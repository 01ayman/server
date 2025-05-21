import { FastifyInstance } from "fastify";
import {
  insertarPartida,
  obtenerPartidas,
  obtenerUsuario,
  updateEmail,
  updateImage,
  updateName,
  verifyJwt,
} from "../controller/UsuarioController";

export async function registerRoutes(server: FastifyInstance) {
  server.get("/me", { preHandler: [verifyJwt] }, obtenerUsuario);
  server.post("/update-avatar", { preHandler: [verifyJwt] }, updateImage);
  server.patch("/update-email", { preHandler: [verifyJwt] }, updateEmail);
  server.patch("/update-name", { preHandler: [verifyJwt] }, updateName);
  server.post(
    "/insertar-partida",
    { preHandler: [verifyJwt] },
    insertarPartida
  );
  server.get("/obtener-partidas", { preHandler: [verifyJwt] }, obtenerPartidas);
}
