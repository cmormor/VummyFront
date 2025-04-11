import { Usuario } from "../types/user";
import { API } from "./api";
import type { AxiosError } from "axios";

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
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;

    if (err.response?.status === 409) {
      return "El nombre o el correo electrónico ya están en uso.";
    }
    if (err.response?.data?.message) {
      return err.response.data.message;
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
      `/users/login?email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`
    );
    return response.data;
  } catch {
    return null;
  }
};

export const logoutUsuario = () => {
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("authToken");

  window.location.href = "/";
};
