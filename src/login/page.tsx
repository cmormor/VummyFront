import { useState } from "react";
import { loginUsuario } from "../api/userApi";
import { Box, TextField, Button, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../assets/VummyLogo_Azul.png";
import { NavBar } from "../components/NavBar";
import { Title } from "../components/Title";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    const user = await loginUsuario(email, password);

    if (user) {
      navigate("/welcome");
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <>
      <NavBar arrow={true} path="/" />
      <Stack
        sx={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.5,
          display: { xs: "none", sm: "block" },
        }}
      >
        <img src={logo} alt="Logo" style={{ height: 150 }} />
      </Stack>

      <Stack
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          borderRadius: "8px",
          position: "relative",
          width: "100%",
        }}
      >
        <Title text="BIENVENIDO A VUMMY" sizeXs="1.5rem" sizeMd="2rem" />
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Email"
              variant="filled"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                backgroundColor: "white",
                borderRadius: "8px",
                borderColor: "white",
              }}
            />
          </Box>

          <Box mb={2}>
            <TextField
              fullWidth
              label="Contraseña"
              variant="filled"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{
                backgroundColor: "white",
                borderRadius: "8px",
              }}
            />
          </Box>

          {error && (
            <Typography
              sx={{
                color: "red",
                textAlign: "center",
                marginBottom: 2,
                fontWeight: "bold",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              marginTop: 2,
              lineHeight: "1.5",
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "0.75rem", md: "1rem" },
              borderRadius: "8px",
            }}
          >
            INICIAR SESIÓN
          </Button>
          <Button
            onClick={() => navigate("/register")}
            fullWidth
            type="submit"
            variant="outlined"
            color="primary"
            sx={{
              marginTop: 2,
              lineHeight: "1.5",
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "0.75rem", md: "1rem" },
              borderRadius: "8px",
              color: "white",
            }}
          >
            ¿NO TIENES CUENTA? REGISTRATE
          </Button>
        </form>
      </Stack>
    </>
  );
};
