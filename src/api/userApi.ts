import { Usuario } from "../types/user";
import { API } from "./api";

export const getUsuarios = async (): Promise<Usuario[]> => {
  const response = await API.get<Usuario[]>("/users");
  return response.data;
};

export const createUsuario = async (
  usuario: Usuario
): Promise<Usuario | string> => {
  try {
    const response = await API.post<Usuario>("/users", usuario);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 409) {
      return "El nombre o el correo electrónico ya están en uso.";
    }
    if (error.response && error.response.data) {
      return error.response.data.message;
    }
    return "Hubo un error al registrar el usuario.";
  }
};

export const loginUsuario = async (
  email: string,
  password: string
): Promise<Usuario | null> => {
  try {
    const response = await API.post<Usuario>(
      `/users/login?email=${email}&password=${password}`
    );
    return response.data;
  } catch (error) {
    return null;
  }
};
