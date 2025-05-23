import { Order, PostOrder } from "../types/order";
import { API } from "./api";

export const getOrdersByUser = async () => {
  const response = await API.get<Order[]>("/orders/user");
  return response.data;
};

export const postOrder = async (order: PostOrder) => {
  const response = await API.post<PostOrder>("/orders", order);
  return response.data;
}