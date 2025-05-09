"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerLecciones = obtenerLecciones;
exports.obtenerEjerciciosPorId = obtenerEjerciciosPorId;
exports.obtenerEjercicios = obtenerEjercicios;
exports.insertarProgreso = insertarProgreso;
exports.obtenerProgresoLeccion = obtenerProgresoLeccion;
const LeccionesRepository_1 = require("../repository/LeccionesRepository");
async function obtenerLecciones(request, reply) {
    return await (0, LeccionesRepository_1.getLecciones)();
}
async function obtenerEjerciciosPorId(request, reply) {
    const { id } = request.params;
    return await (0, LeccionesRepository_1.getEjerciciosById)(id);
}
async function obtenerEjercicios(request, reply) {
    return await (0, LeccionesRepository_1.getEjercicios)();
}
async function insertarProgreso(request, reply) {
    const { usuario_id, leccion_id, ejercicio_id } = request.body;
    const ejercicio = {
        usuario_id,
        leccion_id,
        ejercicio_id,
        completado: true,
        fecha_completado: new Date(),
    };
    if (await (0, LeccionesRepository_1.completarEjercicio)(ejercicio)) {
        reply.send({ ok: true });
    }
}
async function obtenerProgresoLeccion(request, reply) {
    const { usuario_id, leccion_id } = request.params;
    const resultado = await (0, LeccionesRepository_1.obtenerProgresoLeccion)(usuario_id, leccion_id);
    reply.send(resultado);
}
