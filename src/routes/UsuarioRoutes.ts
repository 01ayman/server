import { FastifyInstance } from "fastify";
import {
  obtenerUsuario,
  updateEmail,
  updateImage,
  updateName,
  verifyJwt,
} from "../controller/UsuarioController";

export async function registerRoutes(server: FastifyInstance) {
  server.get("/me", { preHandler: [verifyJwt] }, obtenerUsuario);
  server.patch("/update-avatar", { preHandler: [verifyJwt] }, updateImage);
  server.patch("/update-email", { preHandler: [verifyJwt] }, updateEmail);
  server.patch("/update-name", { preHandler: [verifyJwt] }, updateName);
}
