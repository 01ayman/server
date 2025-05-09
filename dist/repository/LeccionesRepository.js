"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLecciones = getLecciones;
exports.getEjerciciosById = getEjerciciosById;
exports.completarEjercicio = completarEjercicio;
exports.getEjercicios = getEjercicios;
exports.obtenerProgresoLeccion = obtenerProgresoLeccion;
const models_1 = require("../models");
async function getLecciones() {
    try {
        const lecciones = await models_1.Leccion.findAll();
        console.log("\n\n\nLecciones: " + lecciones);
        return lecciones;
    }
    catch (err) {
        throw new Error();
    }
}
async function getEjerciciosById(id) {
    try {
        const ejercicios = await models_1.Ejercicio.findAll({ where: { leccionId: id } });
        return ejercicios;
    }
    catch (err) {
        throw new Error();
    }
}
async function completarEjercicio(ejercicio) {
    try {
        await models_1.ProgresoEjercicio.upsert(ejercicio);
        return true;
    }
    catch (err) {
        throw new Error();
    }
}
async function getEjercicios() {
    try {
        const ejercicios = await models_1.Ejercicio.findAll();
        return ejercicios;
    }
    catch (err) {
        throw new Error();
    }
}
async function obtenerProgresoLeccion(usuario_id, leccion_id) {
    try {
        const resultado = await models_1.Ejercicio.findAll({
            where: { idLeccion: leccion_id },
            attributes: ["id"],
            include: [
                {
                    model: models_1.ProgresoEjercicio,
                    as: "progreso",
                    required: false,
                    where: { usuarioId: usuario_id },
                    attributes: ["completado"],
                },
            ],
        });
        const total = resultado.length;
        const completados = resultado.filter((e) => e.progreso?.completado).length;
        const estado = completados === total
            ? "completados"
            : completados > 0
                ? "en_progreso"
                : "no_iniciado";
        const ejerciciosFormateados = resultado.map((e) => ({
            id: e.id,
            completado: e.progreso?.completado || false,
        }));
        return { ejercicios: ejerciciosFormateados, estado, completados, total };
    }
    catch (err) {
        throw new Error();
    }
}
