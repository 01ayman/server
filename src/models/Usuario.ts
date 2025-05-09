import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/Sequelize";

export class Usuario extends Model {
  declare id: number;
  declare nombre: string;
  declare correo: string;
  declare contrasena_hash: string;
  declare avatar: string | null;
  declare elo: number;
  declare rol: "jugador" | "admin";
  declare verificado: boolean;
  declare token_verificacion: string | null;
  declare creado_en: Date;
}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    contrasena_hash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    elo: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rol: {
      type: DataTypes.ENUM("jugador", "admin"),
      defaultValue: "jugador",
    },
    verificado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    token_verificacion: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    creado_en: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "usuarios",
    timestamps: false,
    underscored: true,
  }
);
