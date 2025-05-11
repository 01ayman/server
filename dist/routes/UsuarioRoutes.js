"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const UsuarioController_1 = require("../controller/UsuarioController");
async function registerRoutes(server) {
    server.get("/me", { preHandler: [UsuarioController_1.verifyJwt] }, UsuarioController_1.obtenerUsuario);
    server.patch("/update-avatar", { preHandler: [UsuarioController_1.verifyJwt] }, UsuarioController_1.updateImage);
    server.patch("/update-email", { preHandler: [UsuarioController_1.verifyJwt] }, UsuarioController_1.updateEmail);
    server.patch("/update-name", { preHandler: [UsuarioController_1.verifyJwt] }, UsuarioController_1.updateName);
}
