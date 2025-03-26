import { useEffect, useState } from "react";
import { getUsuarios } from "../api/userApi";
import { Usuario } from "../types/user";

export const UserList = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const fetchUsuarios = () => {
      getUsuarios().then(setUsuarios).catch(console.error);
    };

    fetchUsuarios();

    const interval = setInterval(fetchUsuarios, 3000);

    return () => clearInterval(interval);
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
