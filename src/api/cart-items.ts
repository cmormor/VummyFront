import { PostCartItem } from "../types/post-cart-item";
import { API } from "./api";

export const postItemToCart = async (item: PostCartItem) => {
  const response = await API.post("/cart", item);
  return response.data;
};

export const getCartItems = async () => {
  const response = await API.get("/cart");
  return response.data;
};

export const putQuantity = async (id: number, cantidad: number) => {
  const response = await API.put(`/cart/${id}`, { cantidad });
  return response.data;
};

export const deleteCart = async () => {
  const response = await API.delete("/cart");
  return response;
};

export const deleteCartPorId = async (id: number) => {
  const response = await API.delete(`/cart/${id}`);
  return response;
};
