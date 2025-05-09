import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/Sequelize";
import { Usuario } from "./Usuario";

export class Torneo extends Model {
  declare id: number;
  declare nombre: string;
  declare fecha: Date;
  declare formato: string;
  declare max_jugadores: number;
  declare creador_id: number;
}

Torneo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
    },
    fecha: {
      type: DataTypes.DATE,
    },
    formato: {
      type: DataTypes.STRING(20),
    },
    max_jugadores: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: "torneos",
    timestamps: false,
    underscored: true,
  }
);

Torneo.belongsTo(Usuario, { foreignKey: "creador_id" });
