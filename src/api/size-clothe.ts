import { Clothe } from "../types/clothe";
import { Size } from "../types/size";
import { API } from "./api";

export const getSizeClothe = async (id: number) => {
    const response = await API.get<Clothe[]>(`clothes/sizes/${id}`);
    return response.data;
};

export const updateClotheSize = async (clotheId: number, sizeData: { talla: { id: number }, cantidad: number }) => {
    const response = await API.post(`/clothes/sizes/${clotheId}`, sizeData);
    return response.data;
};

export const getSizesByStore = async (storeId: number) => {
    const response = await API.get<Size[]>(`/sizes/store/${storeId}`);
    return response.data;
}

export const assignSizeToClothe = async (
    clotheId: number,
    sizeId: number,
    cantidad: number = 10
) => {
    const response = await API.post(`/clothes/sizes/${clotheId}`, [
        {
            tallaId: sizeId,
            cantidad: cantidad
        }
    ]);
    return response.data;
};