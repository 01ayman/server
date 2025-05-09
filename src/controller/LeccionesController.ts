import { FastifyReply, FastifyRequest } from "fastify";
import {
  completarEjercicio,
  getEjercicios,
  getEjerciciosById,
  getLecciones,
  obtenerProgresoLeccion as obtenerProgreso,
} from "../repository/LeccionesRepository";

export async function obtenerLecciones(
  request: FastifyRequest,
  reply: FastifyReply
) {
  return await getLecciones();
}
export async function obtenerEjerciciosPorId(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as any;
  return await getEjerciciosById(id);
}
export async function obtenerEjercicios(
  request: FastifyRequest,
  reply: FastifyReply
) {
  return await getEjercicios();
}

export async function insertarProgreso(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { usuario_id, ejercicio_id } = request.body as any;
  const ejercicio = {
    usuario_id,
    ejercicio_id,
    completado: true,
    fecha_completado: new Date(),
  };
  if (await completarEjercicio(ejercicio)) {
    reply.send({ ok: true });
  }
}
export async function obtenerProgresoLeccion(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { usuario_id, leccion_id } = request.params as any;

  const resultado = await obtenerProgreso(usuario_id, leccion_id);
  reply.send(resultado);
}
