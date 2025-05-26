import { Clothe } from "../types/clothe";
import { API } from "./api";

export const getClothes = async (): Promise<Clothe[]> => {
  const response = await API.get<Clothe[]>("/clothes");
  return response.data;
};


export const getClotheByStoreId = async (
  storeId: number
): Promise<Clothe[]> => {
  try {
    const response = await API.get<Clothe[]>(`/clothes/store/${storeId}`);
    return response.data;
  } catch {
    return [];
  }
};

export const getClotheById = async (id: number): Promise<Clothe> => {
  const response = await API.get<Clothe>(`/clothes/${id}`);
  return response.data;
};

export const postClothe = async (clothe: Clothe): Promise<Clothe> => {
  const response = await API.post<Clothe>("/clothes", clothe);
  return response.data;
};

export const updateClothe = async (
  id: number,
  data: Partial<Clothe>
): Promise<Partial<Clothe> | null> => {
  try {
    const response = await API.put<Clothe>(`/clothes/${id}`, data);
    return response.data;
  } catch {
    return null;
  }
};

export const subirImagenClothe = async (
  id: number,
  imagen: File
): Promise<void> => {
  if (!imagen) throw new Error("No se ha proporcionado un archivo");

  const formData = new FormData();
  formData.append("file", imagen);

  await API.post(`/clothes/${id}/imagen`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteClothe = async (id: number): Promise<void> => {
  await API.delete(`/clothes/${id}`);
};

export const eliminarImagenClothe = async (id: number): Promise<void> => {
  await API.delete(`/clothes/${id}/imagen`);
};
