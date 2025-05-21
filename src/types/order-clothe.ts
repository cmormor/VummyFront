import { Clothe } from "./clothe";

export interface OrderClothe {
    id: number;
    prenda: Clothe;
    talla: {
        id: number;
        nombre: string;
    };
    pedido: any;
    cantidad: number;
}
