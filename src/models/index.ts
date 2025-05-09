import { Amistad } from "./Amistad";
import { Ejercicio } from "./Ejercicio";
import { Leccion } from "./Leccion";
import { Logro } from "./Logro";
import { Mensaje } from "./Mensaje";
import { Participacion } from "./Participacion";
import { Partida } from "./Partida";
import { ProgresoEjercicio } from "./ProgresoEjercicio";
import { Torneo } from "./Torneo";
import { Usuario } from "./Usuario";
import { UsuarioLogro } from "./UsuarioLogro";

// Relaciones Usuario
// Usuario.hasMany(Amistad, {
//   foreignKey: "id_solicitante",
//   as: "solicitudesEnviadas",
// });
// Usuario.hasMany(Amistad, {
//   foreignKey: "id_destinatario",
//   as: "solicitudesRecibidas",
// });
// Usuario.hasMany(Partida, {
//   foreignKey: "jugador_blancas",
//   as: "partidasBlancas",
// });
// Usuario.hasMany(Partida, {
//   foreignKey: "jugador_negras",
//   as: "partidasNegras",
// });
// Usuario.hasMany(Participacion, { foreignKey: "usuario_id" });
// Usuario.hasMany(ProgresoEjercicio, { foreignKey: "usuario_id" });
// Usuario.belongsToMany(Logro, {
//   through: UsuarioLogro,
//   foreignKey: "usuario_id",
// });
// Usuario.hasMany(Mensaje, { foreignKey: "remitente_id" });

// // Relaciones Torneo
// Torneo.hasMany(Participacion, { foreignKey: "torneo_id" });

// // Relaciones Lección
// Leccion.hasMany(Ejercicio, { foreignKey: "idLeccion" });

// // Relaciones Ejercicio
// Ejercicio.hasMany(ProgresoEjercicio, { foreignKey: "ejercicio_id" });

// // Relaciones Logro
// Logro.belongsToMany(Usuario, { through: UsuarioLogro, foreignKey: "logro_id" });

// // Relaciones Partida
// Partida.hasMany(Mensaje, { foreignKey: "partida_id" });
export {
  Usuario,
  Amistad,
  Partida,
  Torneo,
  Participacion,
  Leccion,
  Ejercicio,
  ProgresoEjercicio,
  Logro,
  UsuarioLogro,
  Mensaje,
};
