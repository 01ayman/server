"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const UsuarioController_1 = require("../controller/UsuarioController");
async function registerRoutes(server) {
    server.get('/me', { preHandler: [UsuarioController_1.verifyJwt] }, (req, res) => {
        res.send(req.user);
    });
}
