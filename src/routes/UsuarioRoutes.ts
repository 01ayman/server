import { FastifyInstance } from 'fastify';
import {  verifyJwt } from '../controller/UsuarioController';

export async function registerRoutes(server: FastifyInstance) {
  server.get('/me',{preHandler: [verifyJwt]}, (req, res)=>{
    res.send(req.user)
  });
}
