import { FastifyInstance } from "fastify";
import {
  callEnviarCorreo,
  cambiarContrasena,
  loginUser,
  obtenerToken,
  registrarUsuario,
  updateContrasena,
} from "../controller/AuthController";

export async function registerRoutes(server: FastifyInstance) {
  server.get("/verify/:id/:token", obtenerToken);
  server.post("/cambiar-contrasena", updateContrasena);
  server.post("/enviar-correo-contrasena", cambiarContrasena);
  server.post("/register", registrarUsuario);
  server.post("/login", loginUser);
  server.post("/enviar-correo-verificacion", callEnviarCorreo);
}
