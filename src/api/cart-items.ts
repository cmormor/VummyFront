import { PostCartItem } from "../types/post-cart-item";
import { API } from "./api";

export const postItemToCart = async (item: PostCartItem) => {
    const response = await API.post("/cart", item);
    return response.data;
}

export const getCartItems = async () => {
    const response = await API.get("/cart");
    return response.data;
}

// TODO: Implement the deleteCart function when the order is completed