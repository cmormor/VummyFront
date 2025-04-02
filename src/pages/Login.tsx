import { useState } from "react";
import { loginUsuario } from "../api/userApi";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import logoDiamante from "../assets/VummyLogo_Azul_Diamante.png";
import logo from "../assets/VummyLogo_Azul.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
      <Stack
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "20px",
        }}
      >
        <IconButton
          onClick={() => navigate("/")}
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            color: "gray",
            "&:hover": {
              color: "#fff",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Stack>

      <Stack
        sx={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.5,
        }}
      >
        <img src={logo} alt="Logo" style={{ height: 150 }} />
      </Stack>

      <Stack
        sx={{
          marginTop: "150px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          borderRadius: "8px",
          position: "relative",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 3,
          }}
        >
          <img
            src={logoDiamante}
            alt="Logo Vummy"
            style={{ width: "60px", marginRight: "5px", marginBottom: "5px" }}
          />
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Lexend Zetta', sans-serif",
              fontWeight: "200",
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            BIENVENIDO A VUMMY
          </Typography>
        </Box>

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
        </form>
      </Stack>
    </>
  );
};
