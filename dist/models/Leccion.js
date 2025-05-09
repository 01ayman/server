"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leccion = void 0;
const sequelize_1 = require("sequelize");
const Sequelize_1 = require("../db/Sequelize");
class Leccion extends sequelize_1.Model {
}
exports.Leccion = Leccion;
Leccion.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    contenido: {
        type: sequelize_1.DataTypes.TEXT,
    },
    nivel: {
        type: sequelize_1.DataTypes.ENUM("principiante", "intermedio", "avanzado"),
        allowNull: false,
    },
}, {
    sequelize: Sequelize_1.sequelize,
    tableName: "lecciones",
    timestamps: false,
    underscored: true,
});
