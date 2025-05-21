import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function enviarCorreoVerificacion(
  emailDestino: string,
  token: string,
  id: number,
  nombre: string = "de nuevo,"
) {
  try {
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
  } catch (err: any) {
    console.error(err);
  }
}
export async function enviarCorreoCambiarContrasena(
  emailDestino: string,
  token: string,
  id: number,
  nombre: string = "de nuevo,"
) {
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
