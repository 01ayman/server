import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/Sequelize";
import { Partida } from "./Partida";
import { Usuario } from "./Usuario";

export class Mensaje extends Model {
  declare id: number;
  declare partida_id: string;
  declare remitente_id: number;
  declare contenido: string;
  declare enviado_en: Date;
}

Mensaje.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contenido: {
      type: DataTypes.TEXT,
    },
    enviado_en: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "mensajes",
    timestamps: false,
    underscored: true,
  }
);

Mensaje.belongsTo(Partida, { foreignKey: "partida_id" });
Mensaje.belongsTo(Usuario, { foreignKey: "remitente_id", as: "remitente" });
