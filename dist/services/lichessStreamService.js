"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const undici_1 = require("undici");
const undici_2 = require("undici");
const API_TOKEN = process.env.LICHESS_TOKEN;
async function registerRoutes(server) {
    server.get("/stream/:gameId", streamGame);
    server.get("/resign/:gameId", abandonarPartida);
}
async function abandonarPartida(request, reply) {
    const { gameId } = request.params;
    const resignUrl = `https://lichess.org/api/board/game/${gameId}/resign`;
    try {
        const response = await (0, undici_1.fetch)(resignUrl, {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
            },
        });
        if (!response.ok) {
            reply.status(400).send({ ok: false });
        }
        reply.send({ ok: true });
    }
    catch (err) {
        console.log(err);
    }
}
async function streamGame(request, reply) {
    const { gameId } = request.params;
    const streamUrl = `https://lichess.org/api/board/game/stream/${gameId}`;
    const headers = {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: "application/x-ndjson",
    };
    // Establece headers SSE al cliente
    reply.raw.setHeader("Content-Type", "text/event-stream");
    reply.raw.setHeader("Cache-Control", "no-cache");
    reply.raw.setHeader("Connection", "keep-alive");
    reply.raw.setHeader("Access-Control-Allow-Origin", process.env.ENVIRONMENT === "production"
        ? "https://chesslearn.netlify.app"
        : "http://localhost:5000");
    reply.raw.setHeader("Access-Control-Allow-Credentials", "true");
    reply.raw.flushHeaders();
    try {
        const { body } = await (0, undici_2.request)(streamUrl, {
            headers,
            method: "GET",
        });
        for await (const chunk of body) {
            const data = chunk.toString().trim();
            if (data) {
                const lines = data.split("\n");
                for (const line of lines) {
                    reply.raw.write(`data: ${line}\n\n`);
                }
            }
        }
    }
    catch (err) {
        console.log(err);
        reply.raw.write(`event: error\ndata: ${JSON.stringify(err)}\n\n`);
    }
    finally {
        reply.raw.end();
    }
    return reply;
}
