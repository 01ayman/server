"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Amistad = void 0;
const sequelize_1 = require("sequelize");
const Sequelize_1 = require("../db/Sequelize");
const Usuario_1 = require("./Usuario");
class Amistad extends sequelize_1.Model {
}
exports.Amistad = Amistad;
Amistad.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    estado: {
        type: sequelize_1.DataTypes.ENUM("pendiente", "aceptado", "rechazado"),
        defaultValue: "pendiente",
    },
    fecha_solicitud: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: Sequelize_1.sequelize,
    tableName: "amistad",
    timestamps: false,
    underscored: true,
});
// Relaciones
Usuario_1.Usuario.hasMany(Amistad, {
    foreignKey: "id_solicitante",
    as: "solicitudesEnviadas",
});
Usuario_1.Usuario.hasMany(Amistad, {
    foreignKey: "id_destinatario",
    as: "solicitudesRecibidas",
});
Amistad.belongsTo(Usuario_1.Usuario, { foreignKey: "id_solicitante", as: "solicitante" });
Amistad.belongsTo(Usuario_1.Usuario, {
    foreignKey: "id_destinatario",
    as: "destinatario",
});
