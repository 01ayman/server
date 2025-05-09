"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Partida = void 0;
const sequelize_1 = require("sequelize");
const Sequelize_1 = require("../db/Sequelize");
const Usuario_1 = require("./Usuario");
class Partida extends sequelize_1.Model {
}
exports.Partida = Partida;
Partida.init({
    id: {
        type: sequelize_1.DataTypes.STRING(15),
        primaryKey: true,
    },
    fecha_inicio: {
        type: sequelize_1.DataTypes.DATE,
    },
    fecha_final: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    resultado: {
        type: sequelize_1.DataTypes.ENUM("1-0", "0-1", "½-½"),
        allowNull: true,
    },
    tiempo: {
        type: sequelize_1.DataTypes.STRING(20),
    },
    fen_final: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    movimientos: {
        type: sequelize_1.DataTypes.TEXT,
    },
    contra_maquina: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    nivel_maquina: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    creada_en: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: Sequelize_1.sequelize,
    tableName: "partidas",
    timestamps: false,
    underscored: true,
});
// Relaciones
Partida.belongsTo(Usuario_1.Usuario, { foreignKey: "jugador_blancas", as: "blancas" });
Partida.belongsTo(Usuario_1.Usuario, { foreignKey: "jugador_negras", as: "negras" });
