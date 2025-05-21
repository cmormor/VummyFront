import { Order } from "../types/order";
import { API } from "./api";

export const getOrdersByUser = async () => {
  const response = await API.get<Order[]>("/orders/user");
  return response.data;
};

export const postOrder = async (order: Order) => {
  const response = await API.post<Order>("/orders", order);
  return response.data;
}

// TODO: MANDAR LAS PRENDAS AL CARRITO DESDE LA SELCCION DE PRENDAS
