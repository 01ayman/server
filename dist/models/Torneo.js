"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Torneo = void 0;
const sequelize_1 = require("sequelize");
const Sequelize_1 = require("../db/Sequelize");
const Usuario_1 = require("./Usuario");
class Torneo extends sequelize_1.Model {
}
exports.Torneo = Torneo;
Torneo.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(100),
    },
    fecha: {
        type: sequelize_1.DataTypes.DATE,
    },
    formato: {
        type: sequelize_1.DataTypes.STRING(20),
    },
    max_jugadores: {
        type: sequelize_1.DataTypes.INTEGER,
    },
}, {
    sequelize: Sequelize_1.sequelize,
    tableName: "torneos",
    timestamps: false,
    underscored: true,
});
Torneo.belongsTo(Usuario_1.Usuario, { foreignKey: "creador_id" });
