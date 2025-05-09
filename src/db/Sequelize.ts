import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

let sequelize: any;

if (process.env?.ENVIRONMENT === "production") {
  sequelize = new Sequelize(process.env?.SUPABASE_URI as string, {
    
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Supabase requiere esto
      },
    },
    logging: false, // Muestra las queries en consola
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || "chesslearn",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST || "localhost",
      dialect: "postgres",
      logging: false, // Muestra las queries en consola
    }
  );
}

export default sequelize;

// Función mejorada de prueba de conexión
export async function testDBConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL exitosa.");
    return true;
  } catch (error) {
    console.error("❌ Error conectando a MySQL:", error);
    return false;
  }
}

// module.exports = sequelize;
