import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/Sequelize";
import { Usuario } from "./Usuario";
import { Logro } from "./Logro";

export class UsuarioLogro extends Model {
  declare id: number;
  declare usuario_id: number;
  declare logro_id: number;
  declare fecha_obtenido: Date;
}

UsuarioLogro.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_obtenido: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'usuario_logros',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['usuario_id', 'logro_id']
    }
  ]
});

UsuarioLogro.belongsTo(Usuario, { foreignKey: 'usuario_id' });
UsuarioLogro.belongsTo(Logro, { foreignKey: 'logro_id' });
