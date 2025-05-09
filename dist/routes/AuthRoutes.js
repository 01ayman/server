"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const AuthController_1 = require("../controller/AuthController");
async function registerRoutes(server) {
    server.get("/verify/:id/:token", AuthController_1.obtenerToken);
    server.post("/cambiar-contrasena", AuthController_1.updateContrasena);
    server.post("/enviar-correo-contrasena", AuthController_1.cambiarContrasena);
    server.post("/register", AuthController_1.registrarUsuario);
    server.post("/login", AuthController_1.loginUser);
    server.post("/enviar-correo-verificacion", AuthController_1.callEnviarCorreo);
}
