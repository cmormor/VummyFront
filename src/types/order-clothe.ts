import { Clothe } from "./clothe";
import { Order } from "./order";

export interface OrderClothe {
  id: number;
  prenda: Clothe;
  talla: {
    id: number;
    nombre: string;
  };
  pedido: Order;
  cantidad: number;
}
