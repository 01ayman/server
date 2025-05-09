import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/Sequelize";
import { Usuario } from "./Usuario";
import { Torneo } from "./Torneo";

export class Participacion extends Model {
  declare id: number;
  declare usuario_id: number;
  declare torneo_id: number;
  declare estado: 'pendiente' | 'confirmado' | 'eliminado';
  declare puntuacion: number;
}

Participacion.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmado', 'eliminado'),
    defaultValue: 'pendiente'
  },
  puntuacion: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  tableName: 'participaciones',
  timestamps: false,
  underscored: true
});

Participacion.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Participacion.belongsTo(Torneo, { foreignKey: 'torneo_id' });