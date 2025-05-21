import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { chessError } from "../utils/Error";
import { Partida, Usuario } from "../models";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
): Promise<ResultUser & { url?: string }> {
  try {
    console.log("\n", avatar);
    const validMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validMimeTypes.includes(avatar.mimetype)) {
      return chessError({
        code: 400,
        message: "El archivo debe ser una imagen válida (JPEG, PNG, GIF)",
      });
    }

    const publicId = `usuarios/avatar_${id}`;

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "usuarios",
          public_id: publicId,
          overwrite: true,
        },
        (error, result) => {
          if (error || !result) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      avatar.file.pipe(uploadStream);
    });
    console.log("\n", result);
    const avatarUrl = result.secure_url;

    const user = await Usuario.findByPk(id);
    if (!user) {
      return chessError({ code: 404, message: "Usuario no encontrado" });
    }

    user.avatar = avatarUrl;
    await user.save();

    return {
      code: 200,
      message: "Avatar actualizado correctamente",
      url: avatarUrl,
    };
  } catch (error) {
    console.error(error);
    return chessError({ code: 500, message: "Error al subir el avatar" });
  }
}
export async function registrarPartida(
  idUsuario: number,
  partida: any
): Promise<any> {
  try {
    const p = {
      jugador_blancas: idUsuario,
      ...partida,
    };
    const res = await Partida.create(p);
  } catch (error) {
    console.error(error);
    return chessError({ code: 500, message: "Error al subir el avatar" });
  }
}
export async function getPartidas(idUsuario: number): Promise<any> {
  try {
    const res = await Partida.findAll({
      where: {
        [Op.or]: [
          { jugador_blancas: idUsuario },
          { jugador_negras: idUsuario },
        ],
      },
      order: [["creada_en", "DESC"]],
    });
    const partidas = res.map((p) => {
      return {
        id: p.id,
        fecha_inicio: p.fecha_inicio,
        fecha_final: p.fecha_final,
        tiempo: p.tiempo,
        fen_final: p.fen_final,
        movimientos: p.movimientos,
        contra_maquina: p.contra_maquina,
        nivel_maquina: p.nivel_maquina,
        creada_en: format(new Date(p.creada_en), "dd/MM/yyyy HH:mm", {
          locale: es,
        }),
        id_usuario: idUsuario,
        resultado: p.resultado,
      };
    });
    return partidas;
  } catch (error) {
    console.error(error);
    return chessError({ code: 500, message: "Error al subir el avatar" });
  }
}
