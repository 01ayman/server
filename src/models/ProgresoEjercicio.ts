import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/Sequelize";
import { Ejercicio } from "./Ejercicio";
import { Usuario } from "./Usuario"; // Asume que tienes un modelo Usuario
import { Leccion } from "./Leccion";

export class ProgresoEjercicio extends Model {
  declare id: number;
  declare usuario_id: number;
  declare ejercicio_id: number;
  declare completado: boolean;
  declare fecha_completado: Date | null;
}

ProgresoEjercicio.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    completado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fecha_completado: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "progreso_ejercicios",
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["usuario_id", "ejercicio_id"],
      },
    ],
  }
);

ProgresoEjercicio.belongsTo(Usuario, { foreignKey: "usuario_id" });
ProgresoEjercicio.belongsTo(Ejercicio, { foreignKey: "ejercicio_id" });
