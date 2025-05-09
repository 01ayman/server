"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mensaje = void 0;
const sequelize_1 = require("sequelize");
const Sequelize_1 = require("../db/Sequelize");
const Partida_1 = require("./Partida");
const Usuario_1 = require("./Usuario");
class Mensaje extends sequelize_1.Model {
}
exports.Mensaje = Mensaje;
Mensaje.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    contenido: {
        type: sequelize_1.DataTypes.TEXT,
    },
    enviado_en: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: Sequelize_1.sequelize,
    tableName: "mensajes",
    timestamps: false,
    underscored: true,
});
Mensaje.belongsTo(Partida_1.Partida, { foreignKey: "partida_id" });
Mensaje.belongsTo(Usuario_1.Usuario, { foreignKey: "remitente_id", as: "remitente" });
