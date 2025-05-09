import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/Sequelize";

export class Leccion extends Model {
  declare id: number;
  declare titulo: string;
  declare contenido: string;
  declare nivel: "principiante" | "intermedio" | "avanzado";
}

Leccion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    contenido: {
      type: DataTypes.TEXT,
    },
    nivel: {
      type: DataTypes.ENUM("principiante", "intermedio", "avanzado"),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "lecciones",
    timestamps: false,
    underscored: true,
  }
);
