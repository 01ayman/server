import { FastifyReply, FastifyRequest } from "fastify";
import { updateUser, uploadAvatar } from "../repository/UsuarioRepository";
import { Usuario } from "../models";
import { enviarCorreoVerificacion } from "../utils/EmailService";
import bcrypt from "bcryptjs";

export async function obtenerUsuario(
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send(request.user);
}

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  console.log("\nverificando....");
  console.log(request.headers.authorization);
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.send(err);
  }
}
export async function updateImage(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id, avatar } = request.body as any;
  await uploadAvatar(id, avatar);
}
export async function updateName(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = request.user as any;
    if (!user?.id) {
      return reply.code(401).send({ error: "No autorizado" });
    }

    const { name } = request.body as any;
    const id = user.id;
    console.log("\n" + name);
    if (!name || name.trim().length < 2) {
      return reply.code(400).send({
        error: "El nombre debe tener al menos 2 caracteres",
      });
    }

    // 3. Actualizar usando el repositorio existente
    const result = await updateUser(id, { nombre: name.trim() });

    // 4. Manejar respuesta
    if (result.code !== 200) {
      return reply.code(result.code).send({ error: result.message });
    }

    return reply.code(200).send({
      message: "Nombre actualizado correctamente",
      user: result.user,
    });
  } catch (error) {
    console.error("Error en updateName:", error);
    return reply
      .code(500)
      .send({ error: "Error interno al actualizar el nombre" });
  }
}
export async function updateEmail(
  request: FastifyRequest,
  reply: FastifyReply
) {
  console.log("hola");
  const user = request.user as any;
  console.log("\nuser " + user);

  try {
    const { currentPassword, newEmail } = request.body as any;

    // // 1. Verificar usuario autenticado
    if (!user) {
      return reply.code(401).send({ error: "No autenticado" });
    }

    // // 2. Validar nuevo email
    console.log(newEmail);
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(newEmail.trim())) {
      console.log("no pasa");

      return reply.code(400).send({ error: "Correo electrónico inválido" });
    }

    // 3. Obtener usuario de la base de datos
    console.log("\nID: " + user.id);
    const usuario = await Usuario.findByPk(user.id);
    if (!usuario) {
      return reply.code(404).send({ error: "Usuario no encontrado" });
    }
    console.log("\nasdfasdf");

    // 4. Verificar contraseña actual
    const isMatch = await bcrypt.compare(
      currentPassword,
      usuario.contrasena_hash
    );
    if (!isMatch) {
      return reply.code(401).send({ error: "Contraseña incorrecta" });
    }

    // 5. Verificar si el email ya está en uso
    const existingUser = await Usuario.findOne({ where: { correo: newEmail } });
    if (existingUser) {
      return reply.code(400).send({ error: "Este correo ya está en uso" });
    }
    // 6. Actualizar email (pero marcarlo como no verificado)
    console.log("el usuario: " + existingUser);
    usuario.correo = newEmail;
    usuario.verificado = false;
    await usuario.save();

    const bearer = request.headers.authorization as any;
    const token = bearer.split[1];
    console.log(token);
    // 7. Enviar email de verificación (implementar esta función)
    await enviarCorreoVerificacion(newEmail, token, usuario.id);

    return reply.code(200).send({
      message: "Correo actualizado. Por favor verifica tu nuevo correo.",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
      },
    });
  } catch (error) {
    console.error("Error en update-email:", error);
    return reply.code(500).send({ error: "Error interno del servidor" });
  }
}
