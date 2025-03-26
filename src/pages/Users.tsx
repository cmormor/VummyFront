import { UserForm } from "../components/UserForm";
import { useNavigate } from "react-router-dom";

export const Users = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <UserForm />
      <button onClick={() => navigate("/")}>Volver</button>
    </div>
  );
};
