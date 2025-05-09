import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/Sequelize";
import { Usuario } from "./Usuario";

export class Amistad extends Model {
  declare id: number;
  declare id_solicitante: number;
  declare id_destinatario: number;
  declare estado: "pendiente" | "aceptado" | "rechazado";
  declare fecha_solicitud: Date;
}

Amistad.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "aceptado", "rechazado"),
      defaultValue: "pendiente",
    },
    fecha_solicitud: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "amistad",
    timestamps: false,
    underscored: true,
  }
);

// Relaciones
Usuario.hasMany(Amistad, {
  foreignKey: "id_solicitante",
  as: "solicitudesEnviadas",
});
Usuario.hasMany(Amistad, {
  foreignKey: "id_destinatario",
  as: "solicitudesRecibidas",
});
Amistad.belongsTo(Usuario, { foreignKey: "id_solicitante", as: "solicitante" });
Amistad.belongsTo(Usuario, {
  foreignKey: "id_destinatario",
  as: "destinatario",
});
