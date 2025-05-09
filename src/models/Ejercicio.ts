import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/Sequelize";
import { Leccion } from "./Leccion";

export class Ejercicio extends Model {
  declare id: number;
  declare titulo: string;
  declare descripcion: string;
  declare fenInicial: string;
  declare movimientoSolucion: string;
  declare nivel: number;
  declare idLeccion: number;
}

Ejercicio.init(
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
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fenInicial: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    movimientoSolucion: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    nivel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "ejercicios",
    timestamps: false,
    underscored: true,
  }
);

Ejercicio.belongsTo(Leccion, { foreignKey: "idLeccion" });
Leccion.hasMany(Ejercicio, { foreignKey: "idLeccion" });
