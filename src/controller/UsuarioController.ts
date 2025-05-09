import { FastifyReply, FastifyRequest } from "fastify";

export async function obtenerPerfil(request: FastifyRequest, reply: FastifyReply) {
}

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
    try{
        await request.jwtVerify();
    }catch(err){
        return reply.send(err);
    }
}