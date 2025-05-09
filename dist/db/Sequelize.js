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
exports.sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || "chesslearn", process.env.DB_USER || "root", process.env.DB_PASSWORD || "", {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: false, // Muestra las queries en consola
});
// Función mejorada de prueba de conexión
async function testDBConnection() {
    try {
        await exports.sequelize.authenticate();
        console.log("✅ Conexión a MySQL exitosa.");
        return true;
    }
    catch (error) {
        console.error("❌ Error conectando a MySQL:", error);
        return false;
    }
}
// module.exports = sequelize;
