import { Clothe } from "./clothe";

export interface CartItem {
  id?: number;
  prenda: Clothe;
  talla?: {
    id?: number;
    nombre: string;
  };
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
