import { Usuario } from "../types/user";
import { API } from "./api";
import type { AxiosError } from "axios";

export const getUsuarios = async (): Promise<Usuario[]> => {
  const response = await API.get<Usuario[]>("/users");
  return response.data;
};

export const getUsuarioById = async (id: number): Promise<Usuario> => {
  const response = await API.get<Usuario>(`/users/${id}`);
  return response.data;
};

export const getRol = async (): Promise<string> => {
  const user = await perfilUsuario();
  const response = await API.get<string>(`/users/${user.id}/role`);
  return response.data;
};

export const createUsuario = async (
  usuario: Usuario
): Promise<Usuario | string> => {
  try {
    const response = await API.post<Usuario>("/users/auth/register", usuario);

    const token = response.data.token;
    if (token) {
      localStorage.setItem("authToken", token);
    }

    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;

    if (err.response?.status === 409) {
      return "El nombre o el correo electrónico ya están en uso.";
    }

    return (
      err.response?.data?.message || "Hubo un error al registrar el usuario."
    );
  }
};

export const loginUsuario = async (
  email: string,
  password: string
): Promise<Usuario | null> => {
  try {
    const response = await API.post<Usuario>("/users/auth/login", {
      email,
      password,
    });

    const token = response.data.token;
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      console.warn("No se recibió token de autenticación");
    }

    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    console.error(
      "Error al iniciar sesión:",
      err.response?.data?.message || error
    );
    return null;
  }
};

export const logoutUsuario = () => {
  localStorage.removeItem("authToken");
  window.location.href = "/";
};

export const perfilUsuario = async () => {
  const response = await API.get<Usuario>("/users/profile");
  return response.data;
};

export const updateUsuario = async (data: Partial<Usuario>) => {
  const response = await API.put<Usuario>('/users/profile', data);

  const usuarioActualizado = response.data;

  if (usuarioActualizado.token) {
    localStorage.setItem('authToken', usuarioActualizado.token);
  }

  return usuarioActualizado;
}
