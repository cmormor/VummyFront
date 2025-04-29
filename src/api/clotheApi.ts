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
