import { Clothe } from "./clothe";
import { Size } from "./size";

export interface Store {
  id?: number;
  nombre: string;
  descripcion: string;
  imagenUrl?: string;
  prendas?: Clothe[];
  tallas?: Size[];
}
