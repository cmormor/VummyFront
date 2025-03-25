import { useEffect, useState } from "react";
import { getUsuarios } from "../api/userApi";
import { Usuario } from "../types/user";

export const UserList = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    getUsuarios().then(setUsuarios).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul>
        {usuarios.map((user) => (
          <li key={user.id}>
            {user.nombre} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};
