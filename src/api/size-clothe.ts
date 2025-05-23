import { Clothe } from "../types/clothe";
import { API } from "./api";

export const getSizeClothe = async (id: number) => {
    const response = await API.get<Clothe[]>(`clothes/sizes/${id}`);
    return response.data;
};
