import { Order, PostOrder } from "../types/order";
import { API } from "./api";

export const getOrders = async () => {
  const response = await API.get<Order[]>("/orders");
  return response.data;
};

export const getOrderById = async (id: number) => {
  const response = await API.get<Order>(`/orders/${id}`);
  return response.data;
};

export const getOrdersByUser = async () => {
  const response = await API.get<Order[]>("/orders/user");
  return response.data;
};

export const postOrder = async (order: PostOrder) => {
  const response = await API.post<PostOrder>("/orders", order);
  return response.data;
}

export const updateStatusOrder = async (id: number, status: string) => {
  const response = await API.put<Order>(`/orders/${id}/status?estado=${status}`);
  return response.data;
}

export const deleteOrder = async (id: number) => {
  const response = await API.delete(`/orders/${id}`);
  return response.data;
}