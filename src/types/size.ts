export interface Size {
  id?: number;
  nombre: string;
  altura: number;
  cuelloManga: number;
  pecho: number;
  cintura: number;
  cadera: number;
  entrepierna: number;
  tienda?: {
    id: number;
    name?: string;
  };
}
