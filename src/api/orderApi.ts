import { API } from "./api";

export const getOrdersByUserId = async () => {
  try {
    const response = await API.get(`/orders/user/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};
