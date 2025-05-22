import { Clothe } from "./clothe";

export interface CartItem {
    id?: number;
    prenda: Clothe;
    cantidad: number;
}