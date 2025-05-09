"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const LeccionesController_1 = require("../controller/LeccionesController");
async function registerRoutes(server) {
    server.get("/", LeccionesController_1.obtenerLecciones);
    server.get("/ejercicios", LeccionesController_1.obtenerEjercicios);
    server.get("/:id/ejercicios", LeccionesController_1.obtenerEjerciciosPorId);
    server.get("/:usuario_id/:leccion_id", LeccionesController_1.obtenerProgresoLeccion);
    server.post("/ejercicios", LeccionesController_1.insertarProgreso);
}
