import { FastifyInstance } from "fastify";
import { abandonarPartida, streamGame } from "../services/lichessStreamService";

export async function registerRoutes(server: FastifyInstance) {
  server.get("/stream/:gameId", streamGame);

  server.get("/resign/:gameId", abandonarPartida);
}
