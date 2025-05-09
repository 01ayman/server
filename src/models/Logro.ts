import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/Sequelize';

export class Logro extends Model {
  declare id: number;
  declare nombre: string;
  declare descripcion: string;
  declare icono: string;
}

Logro.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100)
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  icono: {
    type: DataTypes.TEXT
  }
}, {
  sequelize,
  tableName: 'logros',
  timestamps: false,
  underscored: true
});
