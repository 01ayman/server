import { FastifyInstance } from "fastify";
import {
  insertarProgreso,
  obtenerEjercicios,
  obtenerEjerciciosPorId,
  obtenerLecciones,
  obtenerProgresoLeccion,
} from "../controller/LeccionesController";

export async function registerRoutes(server: FastifyInstance) {
  server.get("/", obtenerLecciones);
  server.get("/ejercicios", obtenerEjercicios);
  server.get("/:id/ejercicios", obtenerEjerciciosPorId);
  server.get("/:usuario_id/:leccion_id", obtenerProgresoLeccion);
  server.post("/ejercicios", insertarProgreso);
}
