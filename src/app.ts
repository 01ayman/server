import { sequelize, testDBConnection } from "./db/Sequelize";
import { registerRoutes as AuthRoutes } from "./routes/AuthRoutes";
import { registerRoutes as UsuarioRoutes } from "./routes/UsuarioRoutes";
import { registerRoutes as LichessRoutes } from "./routes/LichessRoutes";
import { registerRoutes as LeccionesRoutes } from "./routes/LeccionesRoutes";
import fastifySocketIO from "fastify-socket.io";
import { setupSockets } from "./socket/socket";

import Fastify from "fastify";
import dotenv from "dotenv";
import { fastifyCors } from "@fastify/cors";
import "./models";
import jwt from "@fastify/jwt";
import { Server } from "socket.io";
import fastifyMultipart from "fastify-multipart";

declare module "fastify" {
  interface FastifyInstance {
    io: Server<{ hello: string }>;
  }
}

dotenv.config();

const app = Fastify({ logger: true });

app.register(fastifyCors, {
  origin: [
    "https://chesslearn.netlify.app",
    "http://localhost:5000",
    "https://01ayman.github.io",
  ],
  methods: ["GET", "POST", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
app.register(fastifyMultipart);
app.register(AuthRoutes, { prefix: "/api/auth" });
app.register(UsuarioRoutes, { prefix: "/api/usuarios" });
app.register(LichessRoutes, { prefix: "/api/lichess" });
app.register(LeccionesRoutes, { prefix: "/api/lecciones" });

app.register(jwt, {
  secret: process.env.JWT_SECRET!,
});

testDBConnection();
async function start() {
  try {

    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL OK");

    sequelize
      .sync()
      .then(() => {
        console.log("Tablas sincronizadas correctamente.");
      })
      .catch((err: any) => {
        console.error("Error al sincronizar las tablas:", err);
      });
    console.log("✅ Modelos sincronizados con la base de datos");

    await app.register(fastifySocketIO, {
      cors: {
        origin: "*",
      },
    });

    app.ready().then(() => {
      setupSockets(app.io); 
    });

    const port = parseInt(process.env.PORT || "3001");
    await app.listen({ port, host: "0.0.0.0" });
  } catch (error) {
    console.error("❌ Error arrancando servidor:", error);
    process.exit(1);
  }
}

start();

export default app;
