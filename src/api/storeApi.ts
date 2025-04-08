import { API } from "./api";
import { Store } from "../types/store";

export const getStores = async (): Promise<Store[]> => {
  const response = await API.get<Store[]>("/stores");
  return response.data;
};

export const getStoreById = async (id: number): Promise<Store | null> => {
  try {
    const response = await API.get<Store>(`/stores/${id}`);
    return response.data;
  } catch {
    return null;
  }
};

export const getStoreByNombre = async (
  nombre: string
): Promise<Store | null> => {
  try {
    const response = await API.get<Store>(
      `/stores/name?nombre=${encodeURIComponent(nombre)}`
    );
    return response.data;
  } catch {
    return null;
  }
};

export const createStore = async (tienda: Store): Promise<Store | string> => {
  try {
    const response = await API.post<Store>("/stores", tienda);
    return response.data;
  } catch (error) {
    const err = error as import("axios").AxiosError<{ message: string }>;
    if (err.response?.data?.message) return err.response.data.message;
    return "Hubo un error al crear la tienda.";
  }
};

export const updateStore = async (
  id: number,
  tienda: Store
): Promise<Store | null> => {
  try {
    const response = await API.put<Store>(`/stores/${id}`, tienda);
    return response.data;
  } catch {
    return null;
  }
};

export const deleteStore = async (id: number): Promise<boolean> => {
  try {
    await API.delete(`/stores/${id}`);
    return true;
  } catch {
    return false;
  }
};
