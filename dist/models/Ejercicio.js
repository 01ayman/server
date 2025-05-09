"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ejercicio = void 0;
const sequelize_1 = require("sequelize");
const Sequelize_1 = require("../db/Sequelize");
const Leccion_1 = require("./Leccion");
class Ejercicio extends sequelize_1.Model {
}
exports.Ejercicio = Ejercicio;
Ejercicio.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    descripcion: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    fenInicial: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
    },
    movimientoSolucion: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    nivel: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
}, {
    sequelize: Sequelize_1.sequelize,
    tableName: "ejercicios",
    timestamps: false,
    underscored: true,
});
Ejercicio.belongsTo(Leccion_1.Leccion, { foreignKey: "idLeccion" });
Leccion_1.Leccion.hasMany(Ejercicio, { foreignKey: "idLeccion" });
