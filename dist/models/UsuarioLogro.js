"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioLogro = void 0;
const sequelize_1 = require("sequelize");
const Sequelize_1 = require("../db/Sequelize");
const Usuario_1 = require("./Usuario");
const Logro_1 = require("./Logro");
class UsuarioLogro extends sequelize_1.Model {
}
exports.UsuarioLogro = UsuarioLogro;
UsuarioLogro.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_obtenido: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    sequelize: Sequelize_1.sequelize,
    tableName: 'usuario_logros',
    timestamps: false,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['usuario_id', 'logro_id']
        }
    ]
});
UsuarioLogro.belongsTo(Usuario_1.Usuario, { foreignKey: 'usuario_id' });
UsuarioLogro.belongsTo(Logro_1.Logro, { foreignKey: 'logro_id' });
