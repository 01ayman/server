import { v2 as cloudinary } from "cloudinary";
import { chessError } from "../utils/Error";
import { Usuario } from "../models";
import bcrypt from "bcryptjs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

interface ResultUser {
  code: number;
  message: string;
}

interface UpdateUserRequest {
  nombre?: string;
  email?: string;
  currentPassword?: string;
  password?: string;
}

interface ResultUser {
  code: number;
  message: string;
  user?: any;
}

export async function updateUser(
  id: number,
  updatedUsuario: UpdateUserRequest
): Promise<ResultUser> {
  try {
    const user = await Usuario.findByPk(id);
    if (!user) {
      return chessError({ code: 404, message: "Usuario no encontrado" });
    }

    // Verificar contraseña actual para cambios sensibles
    if (updatedUsuario.email || updatedUsuario.password) {
      if (!updatedUsuario.currentPassword) {
        return chessError({
          code: 400,
          message: "Se requiere la contraseña actual para realizar este cambio",
        });
      }

      const isMatch = await bcrypt.compare(
        updatedUsuario.currentPassword,
        user.contrasena_hash
      );
      if (!isMatch) {
        return chessError({
          code: 401,
          message: "Contraseña actual incorrecta",
        });
      }
    }

    // Encriptar nueva contraseña si se proporciona
    if (updatedUsuario.password) {
      updatedUsuario.password = await bcrypt.hash(updatedUsuario.password, 10);
      delete updatedUsuario.currentPassword; // Limpiar campo temporal
    }

    // Actualizar campos
    if (updatedUsuario.nombre) user.nombre = updatedUsuario.nombre;
    if (updatedUsuario.email) user.correo = updatedUsuario.email;
    if (updatedUsuario.password) user.contrasena_hash = updatedUsuario.password;

    await user.save();

    const userData = user.toJSON();
    delete userData.password;
    delete userData.currentPassword;

    return {
      code: 200,
      message: "Usuario actualizado correctamente",
      user: userData,
    };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return chessError({
      code: 500,
      message: "Error interno al actualizar el usuario",
    });
  }
}

export async function uploadAvatar(
  id: number,
  avatar: any
): Promise<ResultUser> {
  try {
    const validMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validMimeTypes.includes(avatar.mimetype)) {
      return chessError({
        code: 400,
        message: "El archivo debe ser una imagen válida (JPEG, PNG, GIF)",
      });
    }

    // Subir la imagen a Cloudinary
    const result = await cloudinary.uploader.upload(avatar.file, {
      folder: "usuarios", // Carpeta donde almacenar la imagen
      public_id: `avatar_${id}`, // Puedes personalizar el nombre del archivo con el ID del usuario
    });

    // Obtener la URL pública de la imagen desde Cloudinary
    const avatarUrl = result.secure_url;

    // Buscar al usuario y actualizar su avatar
    const user = await Usuario.findByPk(id);
    if (!user) {
      return chessError({ code: 404, message: "Usuario no encontrado" });
    }

    // Actualizar el campo avatar con la nueva URL
    user.avatar = avatarUrl;
    await user.save();

    return {
      code: 200,
      message: "Avatar actualizado correctamente",
    };
  } catch (error) {
    console.error(error);
    return chessError({ code: 500, message: "Error al subir el avatar" });
  }
}
