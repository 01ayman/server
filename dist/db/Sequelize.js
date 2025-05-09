"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
exports.testDBConnection = testDBConnection;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let s;
console.log("ENVIRONMENT: " + process.env?.ENVIRONMENT);
console.log("ENVIRONMENT: " + process.env?.SUPABASE_URI);
console.log("encoded     " + encodeURIComponent("iFL*Lq0GfVIe8QLN"));
if (process.env?.ENVIRONMENT === "production") {
    s = new sequelize_1.Sequelize(process.env?.SUPABASE_URI, {
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false, // Supabase requiere esto
            },
        },
        logging: false, // Muestra las queries en consola
    });
}
else {
    s = new sequelize_1.Sequelize(process.env.DB_NAME || "chesslearn", process.env.DB_USER || "root", process.env.DB_PASSWORD || "", {
        host: process.env.DB_HOST || "localhost",
        dialect: "postgres",
        logging: false, // Muestra las queries en consola
    });
}
exports.sequelize = s;
// Función mejorada de prueba de conexión
async function testDBConnection() {
    try {
        await exports.sequelize.authenticate();
        console.log("✅ Conexión a PostgreSQL exitosa.");
        return true;
    }
    catch (error) {
        console.error("❌ Error conectando a PostgreSQL:", error);
        return false;
    }
}
// module.exports = sequelize;
