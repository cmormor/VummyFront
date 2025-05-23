import { Clothe } from "./clothe";

export interface CartItem {
  id?: number;
  prenda: Clothe;
  cantidad: number;
}

export interface ApiCartItem {
  id?: number;
  correo?: string;
  prenda: {
    id?: number;
    nombre: string;
    precio?: number;
  };
  talla?: {
    id?: number;
    nombre: string;
  };
  cantidad: number;
}
