import { OrderClothe } from "./order-clothe";

export interface Order {
    id: number;
    usuario: {
        id: number;
        nombre: string;
    };
    fecha: string;
    estado: string;
    total: number;
    prendas: OrderClothe[];
}

export interface PostOrder {
    prendas: {
        prenda: { id: number };
        talla: { id: number };
        cantidad: number;
    }[];
}