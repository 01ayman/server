"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.verifyUserAgain = verifyUserAgain;
exports.enviarCorreoContrasena = enviarCorreoContrasena;
exports.updateNewContrasena = updateNewContrasena;
exports.verificarToken = verificarToken;
exports.verificarLogin = verificarLogin;
exports.generarToken = generarToken;
const Usuario_1 = require("../models/Usuario");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const Error_1 = require("../utils/Error");
const dotenv_1 = __importDefault(require("dotenv"));
const EmailService_1 = require("../utils/EmailService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
async function createUser(nombre, correo, contrasena, rol = "jugador") {
    const token = (0, uuid_1.v4)();
    if (!nombre || !contrasena || !correo) {
        return (0, Error_1.chessError)({ code: 400, message: "Faltan datos" });
    }
    if (nombre.length < 3 || nombre.length > 50) {
        return (0, Error_1.chessError)({
            code: 400,
            message: "El nombre debe tener entre 3 y 50 caracteres",
        });
    }
    if (contrasena.length < 8 || contrasena.length > 50) {
        return (0, Error_1.chessError)({
            code: 400,
            message: "La contraseña debe tener entre 8 y 50 caracteres",
        });
    }
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(correo)) {
        return (0, Error_1.chessError)({
            code: 400,
            message: "El correo debe tener un formato válido",
        });
    }
    if (rol !== "jugador" && rol !== "admin") {
        return (0, Error_1.chessError)({
            code: 400,
            message: "El rol debe ser usuario o admin",
        });
    }
    const findUser = await findUserByCorreo(correo);
    if (findUser) {
        return (0, Error_1.chessError)({ code: 400, message: "El correo ya está registrado" });
    }
    const contraseña_hash = await bcryptjs_1.default.hash(contrasena, 10);
    const nuevoUsuario = {
        nombre,
        contrasena_hash: contraseña_hash,
        correo: correo,
        rol,
        verificado: false,
        token_verificacion: token,
    };
    let usuarioCreado;
    try {
        usuarioCreado = await Usuario_1.Usuario.create(nuevoUsuario);
    }
    catch (error) {
        return (0, Error_1.chessError)({ code: 500, message: "Error creando usuario" });
    }
    await (0, EmailService_1.enviarCorreoVerificacion)(correo, token, usuarioCreado.id, nombre);
    return {
        code: 200,
        message: "Verifica el correo para confirmar el registro",
    };
}
async function verifyUserAgain(correo, contrasena) {
    const token = (0, uuid_1.v4)();
    if (!contrasena || !correo) {
        return (0, Error_1.chessError)({ code: 400, message: "Faltan datos" });
    }
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(correo)) {
        return (0, Error_1.chessError)({
            code: 400,
            message: "El correo debe tener un formato válido",
        });
    }
    const findUser = await findUserByCorreo(correo);
    if (!findUser) {
        return (0, Error_1.chessError)({ code: 400, message: "No se ha encontrado el usuario" });
    }
    const valid = await bcryptjs_1.default.compare(contrasena, findUser.contrasena_hash);
    if (!valid) {
        return (0, Error_1.chessError)({ code: 400, message: "La contraseña es incorrecta" });
    }
    const updatedUsuario = {
        token_verificacion: token,
    };
    try {
        await Usuario_1.Usuario.update(updatedUsuario, { where: { correo } });
    }
    catch (error) {
        return (0, Error_1.chessError)({ code: 500, message: "Error al enviar token" });
    }
    await (0, EmailService_1.enviarCorreoVerificacion)(correo, token, findUser.id);
    return { code: 200, message: "Verifica de nuevo el correo" };
}
async function enviarCorreoContrasena(correo) {
    const token = (0, uuid_1.v4)();
    console.log(correo);
    if (!correo) {
        return (0, Error_1.chessError)({ code: 400, message: "Faltan datos" });
    }
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(correo)) {
        return (0, Error_1.chessError)({
            code: 400,
            message: "El correo debe tener un formato válido",
        });
    }
    const findUser = await findUserByCorreo(correo);
    if (!findUser) {
        return (0, Error_1.chessError)({ code: 400, message: "No se ha encontrado el usuario" });
    }
    const updatedUsuario = {
        token_verificacion: token,
    };
    try {
        await Usuario_1.Usuario.update(updatedUsuario, { where: { correo } });
    }
    catch (error) {
        return (0, Error_1.chessError)({ code: 500, message: "Error al enviar token" });
    }
    await (0, EmailService_1.enviarCorreoCambiarContrasena)(correo, token, findUser.id);
    return { code: 200, message: "Verifica de nuevo el correo" };
}
async function updateNewContrasena(id, token, contrasena) {
    const usuario = await Usuario_1.Usuario.findByPk(id);
    if (!usuario) {
        return false;
    }
    if (usuario.token_verificacion === token) {
        usuario.verificado = true;
        usuario.token_verificacion = "";
        const newPass = await bcryptjs_1.default.hash(contrasena, 10);
        usuario.contrasena_hash = newPass;
        await usuario.save();
        return true;
    }
    return false;
}
async function verificarToken(id, token) {
    const usuario = await Usuario_1.Usuario.findByPk(id);
    if (!usuario) {
        return false;
    }
    if (usuario.token_verificacion === token) {
        usuario.verificado = true;
        usuario.token_verificacion = "";
        await usuario.save();
        return true;
    }
    return false;
}
async function verificarLogin(correo, contrasena, recordarme) {
    try {
        console.log(correo);
        console.log(contrasena);
        const usuario = await Usuario_1.Usuario.findOne({ where: { correo } });
        console.log(usuario);
        if (!usuario) {
            return (0, Error_1.chessError)({ code: 404, message: "No se encontró el usuario" });
        }
        if (!usuario.verificado) {
            return (0, Error_1.chessError)({
                code: 403,
                message: "La cuenta no ha sido verificada",
            });
        }
        const valid = await bcryptjs_1.default.compare(contrasena, usuario.contrasena_hash);
        if (!valid) {
            return (0, Error_1.chessError)({ code: 400, message: "La contraseña es incorrecta" });
        }
        const dataToken = {
            id: usuario.id,
            correo: usuario.correo,
            avatar: usuario.avatar,
            elo: usuario.elo,
            nombre: usuario.nombre,
            rol: usuario.rol,
        };
        const token = generarToken(dataToken, recordarme);
        console.log(token);
        console.log(jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET));
        const data = {
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
            },
        };
        return data;
    }
    catch (error) {
        console.log("\nError: " + error);
        return (0, Error_1.chessError)({ code: 400, message: "El correo ya está registrado" });
    }
}
async function findUserByCorreo(correo) {
    return await Usuario_1.Usuario.findOne({ where: { correo } });
}
function generarToken(usuario, recordar) {
    const tiempoExpiracion = recordar ? "30d" : "1h";
    return jsonwebtoken_1.default.sign({
        id: usuario.id,
        rol: usuario.rol,
        nombre: usuario.nombre,
        correo: usuario.correo,
        avatar: usuario.avatar,
        elo: usuario.elo,
    }, process.env.JWT_SECRET, {
        expiresIn: tiempoExpiracion,
    });
}
