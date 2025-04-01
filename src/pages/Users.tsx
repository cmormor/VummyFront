import { UserForm } from "../components/UserFormRegister";
import { UserList } from "../components/UserList";
import { useNavigate } from "react-router-dom";

export const Users = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <UserForm />
      <UserList />
      <button onClick={() => navigate("/")}>Volver</button>
    </div>
  );
};
