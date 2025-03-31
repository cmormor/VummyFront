import { UserForm } from "../components/UserForm";
import { useNavigate } from "react-router-dom";
import { UserList } from "../components/UserList";

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
