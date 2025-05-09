"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgresoEjercicio = void 0;
const sequelize_1 = require("sequelize");
const Sequelize_1 = require("../db/Sequelize");
const Ejercicio_1 = require("./Ejercicio");
const Usuario_1 = require("./Usuario"); // Asume que tienes un modelo Usuario
const Leccion_1 = require("./Leccion");
class ProgresoEjercicio extends sequelize_1.Model {
}
exports.ProgresoEjercicio = ProgresoEjercicio;
ProgresoEjercicio.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    completado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    fecha_completado: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize: Sequelize_1.sequelize,
    tableName: "progreso_ejercicios",
    timestamps: false,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ["usuario_id", "ejercicio_id"],
        },
    ],
});
ProgresoEjercicio.belongsTo(Usuario_1.Usuario, { foreignKey: "usuario_id" });
ProgresoEjercicio.belongsTo(Leccion_1.Leccion, { foreignKey: "leccion_id" });
ProgresoEjercicio.belongsTo(Ejercicio_1.Ejercicio, { foreignKey: "ejercicio_id" });
