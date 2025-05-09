"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerPerfil = obtenerPerfil;
exports.verifyJwt = verifyJwt;
async function obtenerPerfil(request, reply) {
}
async function verifyJwt(request, reply) {
    try {
        await request.jwtVerify();
    }
    catch (err) {
        return reply.send(err);
    }
}
