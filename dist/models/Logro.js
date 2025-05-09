"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logro = void 0;
const sequelize_1 = require("sequelize");
const Sequelize_1 = require("../db/Sequelize");
class Logro extends sequelize_1.Model {
}
exports.Logro = Logro;
Logro.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(100)
    },
    descripcion: {
        type: sequelize_1.DataTypes.TEXT
    },
    icono: {
        type: sequelize_1.DataTypes.TEXT
    }
}, {
    sequelize: Sequelize_1.sequelize,
    tableName: 'logros',
    timestamps: false,
    underscored: true
});
