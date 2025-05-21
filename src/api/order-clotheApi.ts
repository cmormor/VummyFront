import { API } from "./api";

export const updateOrderItemQuantity = async (id: number, cantidad: number) => {
    const response = await API.put(`/order-items/${id}?cantidad=${cantidad}`
    );
    return response.data;
};
