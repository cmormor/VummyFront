export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  rol?: string;
  password?: string;
  altura: number;
  cuelloManga: number;
  pecho: number;
  cintura: number;
  cadera: number;
  entrepierna: number;
  token?: string;
}
