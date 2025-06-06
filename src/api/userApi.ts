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
    const err = error as AxiosError<{ errores?: Record<string, string> }>;

    if (err.response?.status === 409) {
      return "El nombre o el correo electrónico ya están en uso.";
    }

    const errores = err.response?.data?.errores;

    if (errores) {
      const mensajes = Object.values(errores).join(" | ");
      return mensajes;
    }

    return err.response?.data as string;
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

export const updateUsuarioById = async (id: number, data: Partial<Usuario>) => {
  const response = await API.put<Usuario>(`/users/${id}`, data);
  return response.data;
};

export const resetPassword = async (email: string, newPassword: string): Promise<string> => {

  const response = await API.put<{ message: string }>("/users/auth/reset-password", {
    email,
    newPassword,
  });

  return response.data.message;
};

export const deleteUser = async (id: number) => {
  const response = await API.delete(`/users/${id}`)
  return response;
}

