"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize_1 = require("./db/Sequelize");
const AuthRoutes_1 = require("./routes/AuthRoutes");
const UsuarioRoutes_1 = require("./routes/UsuarioRoutes");
const lichessStreamService_1 = require("./services/lichessStreamService");
const LeccionesRoutes_1 = require("./routes/LeccionesRoutes");
const fastify_socket_io_1 = __importDefault(require("fastify-socket.io"));
const socket_1 = require("./socket/socket");
const fastify_1 = __importDefault(require("fastify"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = require("@fastify/cors");
require("./models");
const jwt_1 = __importDefault(require("@fastify/jwt"));
dotenv_1.default.config();
const app = (0, fastify_1.default)({ logger: true });
// app.register(cors, {
//   origin: "*",
// });
app.register(cors_1.fastifyCors, {
    origin: ["http://localhost:5000"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
});
// Registrar rutas
app.register(AuthRoutes_1.registerRoutes, { prefix: "/api/auth" });
app.register(UsuarioRoutes_1.registerRoutes, { prefix: "/api/usuarios" });
app.register(lichessStreamService_1.registerRoutes, { prefix: "/api/lichess" });
app.register(LeccionesRoutes_1.registerRoutes, { prefix: "/api/lecciones" });
app.register(jwt_1.default, {
    secret: process.env.JWT_SECRET,
});
(0, Sequelize_1.testDBConnection)();
async function start() {
    try {
        // Conectar a la base de datos
        await Sequelize_1.sequelize.authenticate();
        console.log("✅ Conexión a MySQL OK");
        // Sincronizar modelos
        Sequelize_1.sequelize
            .sync()
            .then(() => {
            console.log("Tablas sincronizadas correctamente.");
        })
            .catch((err) => {
            console.error("Error al sincronizar las tablas:", err);
        });
        console.log("✅ Modelos sincronizados con la base de datos");
        await app.register(fastify_socket_io_1.default, {
            cors: {
                origin: "*", // o tu frontend URL exacta
            },
        });
        app.ready().then(() => {
            (0, socket_1.setupSockets)(app.io); // << ESTE ES IMPORTANTE
        });
        // Lanzar servidor
        const port = parseInt(process.env.PORT || "3001");
        await app.listen({ port, host: "0.0.0.0" });
    }
    catch (error) {
        console.error("❌ Error arrancando servidor:", error);
        process.exit(1);
    }
}
start();
exports.default = app;
