import fastify from "fastify";
import { Ejercicio, Leccion, ProgresoEjercicio } from "../models";
import db from "sequelize";

export async function getLecciones(): Promise<Leccion[]> {
  try {
    const lecciones = await Leccion.findAll();
    console.log("\n\n\nLecciones: " + lecciones);
    return lecciones;
  } catch (err: any) {
    throw new Error();
  }
}

export async function getEjerciciosById(id: number): Promise<Ejercicio[]> {
  try {
    const ejercicios = await Ejercicio.findAll({ where: { leccionId: id } });
    return ejercicios;
  } catch (err: any) {
    throw new Error();
  }
}

export async function completarEjercicio(ejercicio: any): Promise<boolean> {
  try {
    await ProgresoEjercicio.upsert(ejercicio);
    return true;
  } catch (err: any) {
    throw new Error();
  }
}
export async function getEjercicios(): Promise<Ejercicio[]> {
  try {
    const ejercicios = await Ejercicio.findAll();
    return ejercicios;
  } catch (err: any) {
    console.error("Error al obtener ejercicios:", err); // Aquí podemos ver el error en la consola
    throw new Error(`Error al obtener ejercicios: ${err.message || err}`); // Lanza un error más descriptivo
  }
}
export async function obtenerProgresoLeccion(
  usuario_id: number,
  leccion_id: number
): Promise<any> {
  try {
    const ejercicios = await Ejercicio.findAll({
      where: { idLeccion: leccion_id },
      attributes: ["id"],
      include: [
        {
          model: ProgresoEjercicio,
          as: "progreso",
          required: false,
          where: { usuarioId: usuario_id },
          attributes: ["completado"],
        },
      ],
    });

    const total = ejercicios.length;
    const completados = ejercicios.filter(
      (e: any) => e.progreso?.completado
    ).length;
    const estado =
      completados === total
        ? "completados"
        : completados > 0
        ? "en_progreso"
        : "no_iniciado";

    const ejerciciosFormateados = ejercicios.map((e: any) => ({
      id: e.id,
      completado: e.progreso?.completado || false,
    }));

    return { ejercicios: ejerciciosFormateados, estado, completados, total };
  } catch (err: any) {
    throw new Error();
  }
}
