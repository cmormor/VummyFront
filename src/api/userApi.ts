import { Usuario } from "../types/user";
import { API } from "./api";

export const getUsuarios = async (): Promise<Usuario[]> => {
  const response = await API.get<Usuario[]>("/users");
  return response.data;
};

export const createUsuario = async (usuario: Usuario): Promise<Usuario> => {
  const response = await API.post<Usuario>("/users", usuario);
  return response.data;
};
