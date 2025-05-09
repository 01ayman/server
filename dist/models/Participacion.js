"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Participacion = void 0;
const sequelize_1 = require("sequelize");
const Sequelize_1 = require("../db/Sequelize");
const Usuario_1 = require("./Usuario");
const Torneo_1 = require("./Torneo");
class Participacion extends sequelize_1.Model {
}
exports.Participacion = Participacion;
Participacion.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    estado: {
        type: sequelize_1.DataTypes.ENUM('pendiente', 'confirmado', 'eliminado'),
        defaultValue: 'pendiente'
    },
    puntuacion: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize: Sequelize_1.sequelize,
    tableName: 'participaciones',
    timestamps: false,
    underscored: true
});
Participacion.belongsTo(Usuario_1.Usuario, { foreignKey: 'usuario_id' });
Participacion.belongsTo(Torneo_1.Torneo, { foreignKey: 'torneo_id' });
