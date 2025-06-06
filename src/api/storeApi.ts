import { API } from "./api";
import { Store } from "../types/store";
import { Size } from "../types/size";

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
  data: Partial<Store>
): Promise<Partial<Store> | null> => {
  try {
    const response = await API.put<Store>(`/stores/${id}`, data);
    return response.data;
  } catch {
    return null;
  }
};

export const deleteStore = async (id: number) => {
  const response = await API.delete(`/stores/${id}`)
  return response;
}

export const sizesStore = async (id: number): Promise<Size[]> => {
  const response = await API.get<Size[]>(`/stores/${id}/sizes`);
  return response.data;
};

export const postSizes = async (data: Size) => {
  const response = await API.post<Size>("sizes", data);
  return response.data;
}

