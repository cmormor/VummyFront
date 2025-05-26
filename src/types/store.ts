import { Clothe } from "./clothe";

export interface Store {
  id?: number;
  nombre: string;
  descripcion: string;
  imagenUrl?: string;
  prendas?: Clothe[];
}
