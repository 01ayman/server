// src/routes/streamRoute.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { fetch } from "undici";
import { PassThrough, Readable } from "stream";
import { request as UndiciRequest } from "undici";
const API_TOKEN = process.env.LICHESS_TOKEN;

export async function abandonarPartida(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { gameId } = request.params as any;
  const resignUrl = `https://lichess.org/api/board/game/${gameId}/resign`;
  try {
    const response = await fetch(resignUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    const result = await response.json();

    if (!response.ok) {
      reply.status(400).send({ ok: false });
      return;
    }

    reply.send(result);

    reply.send(result);
  } catch (err: any) {
    console.log(err);
  }
}

export async function streamGame(request: FastifyRequest, reply: FastifyReply) {
  const { gameId } = request.params as any;

  const streamUrl = `https://lichess.org/api/board/game/stream/${gameId}`;

  const headers = {
    Authorization: `Bearer ${API_TOKEN}`,
    Accept: "application/x-ndjson",
  };
  const location =
    process.env.ENVIRONMENT == "production"
      ? "https://chesslearn.netlify.app"
      : "http://localhost:5000";
  console.log(location);
  // Establece headers SSE al cliente
  reply.raw.setHeader("Content-Type", "text/event-stream");
  reply.raw.setHeader("Cache-Control", "no-cache");
  reply.raw.setHeader("Connection", "keep-alive");
  reply.raw.setHeader("Access-Control-Allow-Origin", location);
  reply.raw.setHeader("Access-Control-Allow-Credentials", "true");
  reply.raw.flushHeaders();

  try {
    const { body } = await UndiciRequest(streamUrl, {
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
  } catch (err) {
    console.log(err);
    reply.raw.write(`event: error\ndata: ${JSON.stringify(err)}\n\n`);
  } finally {
    reply.raw.end();
  }

  return reply;
}
