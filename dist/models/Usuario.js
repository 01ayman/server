"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const sequelize_1 = require("sequelize");
const Sequelize_1 = require("../db/Sequelize");
class Usuario extends sequelize_1.Model {
}
exports.Usuario = Usuario;
Usuario.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    correo: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    contrasena_hash: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    avatar: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    elo: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    rol: {
        type: sequelize_1.DataTypes.ENUM("jugador", "admin"),
        defaultValue: "jugador",
    },
    verificado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    token_verificacion: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    creado_en: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: Sequelize_1.sequelize,
    tableName: "usuarios",
    timestamps: false,
    underscored: true,
});
