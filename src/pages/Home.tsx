import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Bienvenido a la App</h1>
      <button onClick={() => navigate("/users")}>Usuarios</button>
    </div>
  );
};
