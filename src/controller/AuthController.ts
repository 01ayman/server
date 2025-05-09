import { FastifyRequest, FastifyReply } from "fastify";
import {
  createUser,
  enviarCorreoContrasena,
  updateNewContrasena,
  verificarLogin,
  verificarToken,
  verifyUserAgain,
} from "../repository/AuthRepository";
import { enviarCorreoVerificacion } from "../utils/EmailService";

export async function registrarUsuario(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { nombre, correo, contrasena } = request.body as any;

  const result = await createUser(nombre, correo, contrasena);

  return reply.send(result);
}
export async function callEnviarCorreo(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { correo, contrasena } = request.body as any;
  return await verifyUserAgain(correo, contrasena);
}
export async function obtenerToken(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id, token } = request.params as any;

  const esIgual = await verificarToken(id, token);

  return reply.send(esIgual);
}
export async function cambiarContrasena(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { correo } = request.body as any;
  return await enviarCorreoContrasena(correo);
}
export async function updateContrasena(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id, token, contrasena } = request.body as any;
  return await updateNewContrasena(id, token, contrasena);
}

export async function loginUser(request: FastifyRequest, reply: FastifyReply) {
  const { correo, contrasena, recordarme } = request.body as any;

  const user = await verificarLogin(correo, contrasena, recordarme);

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
