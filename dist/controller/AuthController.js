"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarUsuario = registrarUsuario;
exports.callEnviarCorreo = callEnviarCorreo;
exports.obtenerToken = obtenerToken;
exports.cambiarContrasena = cambiarContrasena;
exports.updateContrasena = updateContrasena;
exports.loginUser = loginUser;
const AuthRepository_1 = require("../repository/AuthRepository");
async function registrarUsuario(request, reply) {
    const { nombre, correo, contrasena } = request.body;
    const result = await (0, AuthRepository_1.createUser)(nombre, correo, contrasena);
    return reply.send(result);
}
async function callEnviarCorreo(request, reply) {
    const { correo, contrasena } = request.body;
    return await (0, AuthRepository_1.verifyUserAgain)(correo, contrasena);
}
async function obtenerToken(request, reply) {
    const { id, token } = request.params;
    const esIgual = await (0, AuthRepository_1.verificarToken)(id, token);
    return reply.send(esIgual);
}
async function cambiarContrasena(request, reply) {
    const { correo } = request.body;
    return await (0, AuthRepository_1.enviarCorreoContrasena)(correo);
}
async function updateContrasena(request, reply) {
    const { id, token, contrasena } = request.body;
    return await (0, AuthRepository_1.updateNewContrasena)(id, token, contrasena);
}
async function loginUser(request, reply) {
    const { correo, contrasena, recordarme } = request.body;
    const user = await (0, AuthRepository_1.verificarLogin)(correo, contrasena, recordarme);
    return reply.send(user);
    // const user = await Usuario.findOne({ where: { correo } });
    // if (!user) {
    //   return reply.status(400).send({ error: 'Usuario no encontrado' });
    // }
    // const valid = await bcrypt.compare(contrasena, user.contrasena_hash);
    // if (!valid) {
    //   return reply.status(400).send({ error: 'Contraseña incorrecta' });
    // }
    // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    // return reply.send({ token });
}
