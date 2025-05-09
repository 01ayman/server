import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/Sequelize";
import { Usuario } from "./Usuario";

export class Partida extends Model {
  declare id: string;
  declare jugador_blancas: number | null;
  declare jugador_negras: number | null;
  declare fecha_inicio: Date;
  declare fecha_final: Date | null;
  declare resultado: "1-0" | "0-1" | "½-½" | null;
  declare tiempo: string;
  declare fen_final: string | null;
  declare movimientos: string;
  declare contra_maquina: boolean;
  declare nivel_maquina: number | null;
  declare creada_en: Date;
}

Partida.init(
  {
    id: {
      type: DataTypes.STRING(15),
      primaryKey: true,
    },
    fecha_inicio: {
      type: DataTypes.DATE,
    },
    fecha_final: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resultado: {
      type: DataTypes.ENUM("1-0", "0-1", "½-½"),
      allowNull: true,
    },
    tiempo: {
      type: DataTypes.STRING(20),
    },
    fen_final: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    movimientos: {
      type: DataTypes.TEXT,
    },
    contra_maquina: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    nivel_maquina: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    creada_en: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "partidas",
    timestamps: false,
    underscored: true,
  }
);

// Relaciones
Partida.belongsTo(Usuario, { foreignKey: "jugador_blancas", as: "blancas" });
Partida.belongsTo(Usuario, { foreignKey: "jugador_negras", as: "negras" });
