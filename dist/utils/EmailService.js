"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarCorreoVerificacion = enviarCorreoVerificacion;
exports.enviarCorreoCambiarContrasena = enviarCorreoCambiarContrasena;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});
async function enviarCorreoVerificacion(emailDestino, token, id, nombre = "de nuevo,") {
    const verificationLink = `http://localhost:5000/verify/${id}/${token}`;
    const mailOptions = {
        from: `"ChessLearn" <${process.env.MAIL_USER}>`,
        to: emailDestino,
        subject: "Verifica tu cuenta en ChessLearn",
        html: `
      <h2>Hola ${nombre} 👋,</h2>
      <p>Gracias por registrarte en ChessLearn.</p>
      <p>Por favor haz clic en el siguiente enlace para verificar tu cuenta:</p>
      <a href="${verificationLink}">Verificar cuenta</a>
      <p>¡Nos vemos en el tablero! ♟️</p>
    `,
    };
    await transporter.sendMail(mailOptions);
}
async function enviarCorreoCambiarContrasena(emailDestino, token, id, nombre = "de nuevo,") {
    const verificationLink = `http://localhost:5000/cambiar-contrasena/${id}/${token}`;
    const mailOptions = {
        from: `"ChessLearn" <${process.env.MAIL_USER}>`,
        to: emailDestino,
        subject: "Cambia tu contraseña de ChessLearn",
        html: `
      <h2>Hola ${nombre} 👋,</h2>
      <p>Por favor haz clic en el siguiente enlace para terminar de cambiar tu contraseña:</p>
      <a href="${verificationLink}">Cambiar contraseña</a>
      <p>¡Nos vemos en el tablero! ♟️</p>
    `,
    };
    await transporter.sendMail(mailOptions);
}
