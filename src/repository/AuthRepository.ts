import { UUIDV4 } from "sequelize";
import { Usuario } from "../models/Usuario";
import bcrypt from "bcryptjs";
import emailjs from "emailjs-com";
import { v4 as uuidv4 } from "uuid";
import { chessError } from "../utils/Error";
import dotenv from "dotenv";
import {
  enviarCorreoCambiarContrasena,
  enviarCorreoVerificacion,
} from "../utils/EmailService";
import jwt from "jsonwebtoken";
dotenv.config();

interface ResultUser {
  code: number;
  message: string;
}
interface ResultLogin {
  token: string;
  usuario: {
    id: number;
    nombre: string;
    correo: string;
  };
}

export async function createUser(
  nombre: string,
  correo: string,
  contrasena: string,
  rol: string = "jugador"
): Promise<ResultUser> {
  const token = uuidv4();

  if (!nombre || !contrasena || !correo) {
    return chessError({ code: 400, message: "Faltan datos" });
  }
  if (nombre.length < 3 || nombre.length > 50) {
    return chessError({
      code: 400,
      message: "El nombre debe tener entre 3 y 50 caracteres",
    });
  }
  if (contrasena.length < 8 || contrasena.length > 50) {
    return chessError({
      code: 400,
      message: "La contraseña debe tener entre 8 y 50 caracteres",
    });
  }
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correoRegex.test(correo)) {
    return chessError({
      code: 400,
      message: "El correo debe tener un formato válido",
    });
  }
  if (rol !== "jugador" && rol !== "admin") {
    return chessError({
      code: 400,
      message: "El rol debe ser usuario o admin",
    });
  }
  const findUser = await findUserByCorreo(correo);
  if (findUser) {
    return chessError({ code: 400, message: "El correo ya está registrado" });
  }

  const contraseña_hash = await bcrypt.hash(contrasena, 10);

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
    usuarioCreado = await Usuario.create(nuevoUsuario);
  } catch (error) {
    return chessError({ code: 500, message: "Error creando usuario" });
  }

  await enviarCorreoVerificacion(correo, token, usuarioCreado!.id, nombre);

  return {
    code: 200,
    message: "Verifica el correo para confirmar el registro",
  };
}
export async function verifyUserAgain(
  correo: string,
  contrasena: string
): Promise<ResultUser> {
  const token = uuidv4();

  if (!contrasena || !correo) {
    return chessError({ code: 400, message: "Faltan datos" });
  }
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correoRegex.test(correo)) {
    return chessError({
      code: 400,
      message: "El correo debe tener un formato válido",
    });
  }

  const findUser = await findUserByCorreo(correo);
  if (!findUser) {
    return chessError({ code: 400, message: "No se ha encontrado el usuario" });
  }

  const valid = await bcrypt.compare(contrasena, findUser.contrasena_hash);

  if (!valid) {
    return chessError({ code: 400, message: "La contraseña es incorrecta" });
  }

  const updatedUsuario = {
    token_verificacion: token,
  };
  try {
    await Usuario.update(updatedUsuario, { where: { correo } });
  } catch (error) {
    return chessError({ code: 500, message: "Error al enviar token" });
  }

  await enviarCorreoVerificacion(correo, token, findUser.id);

  return { code: 200, message: "Verifica de nuevo el correo" };
}
export async function enviarCorreoContrasena(
  correo: string
): Promise<ResultUser> {
  const token = uuidv4();
  console.log(correo);
  if (!correo) {
    return chessError({ code: 400, message: "Faltan datos" });
  }
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correoRegex.test(correo)) {
    return chessError({
      code: 400,
      message: "El correo debe tener un formato válido",
    });
  }

  const findUser = await findUserByCorreo(correo);
  if (!findUser) {
    return chessError({ code: 400, message: "No se ha encontrado el usuario" });
  }

  const updatedUsuario = {
    token_verificacion: token,
  };
  try {
    await Usuario.update(updatedUsuario, { where: { correo } });
  } catch (error) {
    return chessError({ code: 500, message: "Error al enviar token" });
  }

  await enviarCorreoCambiarContrasena(correo, token, findUser.id);

  return { code: 200, message: "Verifica de nuevo el correo" };
}
export async function updateNewContrasena(
  id: string,
  token: string,
  contrasena: string
): Promise<boolean> {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    return false;
  }
  if (usuario.token_verificacion === token) {
    usuario.verificado = true;
    usuario.token_verificacion = "";
    const newPass = await bcrypt.hash(contrasena, 10);
    usuario.contrasena_hash = newPass;
    await usuario.save();
    return true;
  }
  return false;
}

export async function verificarToken(
  id: number,
  token: string
): Promise<boolean> {
  const usuario = await Usuario.findByPk(id);
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
export async function verificarLogin(
  correo: string,
  contrasena: string,
  recordarme: boolean
): Promise<ResultLogin | ResultUser> {
  try {
    console.log(correo);
    console.log(contrasena);
    const usuario = await Usuario.findOne({ where: { correo } });
    console.log(usuario);
    if (!usuario) {
      return chessError({ code: 404, message: "No se encontró el usuario" });
    }
    if (!usuario.verificado) {
      return chessError({
        code: 403,
        message: "La cuenta no ha sido verificada",
      });
    }
    const valid = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!valid) {
      return chessError({ code: 400, message: "La contraseña es incorrecta" });
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
    console.log(jwt.verify(token, process.env.JWT_SECRET!));
    const data = {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
      },
    };
    return data;
  } catch (error) {
    console.log("\nError: " + error);
    return chessError({ code: 400, message: "El correo ya está registrado" });
  }
}

async function findUserByCorreo(correo: string) {
  return await Usuario.findOne({ where: { correo } });
}

export function generarToken(
  usuario: {
    id: number;
    rol?: string;
    correo?: string;
    avatar?: string | null;
    elo?: number;
    nombre?: string;
  },
  recordar: boolean
) {
  const tiempoExpiracion = recordar ? "30d" : "1h";
  return jwt.sign(
    {
      id: usuario.id,
      rol: usuario.rol,
      nombre: usuario.nombre,
      correo: usuario.correo,
      avatar: usuario.avatar,
      elo: usuario.elo,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: tiempoExpiracion,
    }
  );
}
