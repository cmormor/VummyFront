import { useState } from "react";
import { createUsuario } from "../api/userApi";
import { Usuario } from "../types/user";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import logoDiamante from "../assets/VummyLogo_Azul_Diamante.png";
import logo from "../assets/VummyLogo_Azul.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const Register = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [altura, setAltura] = useState<number | string>("");
  const [cuelloManga, setCuelloManga] = useState<number | string>("");
  const [pecho, setPecho] = useState<number | string>("");
  const [cintura, setCintura] = useState<number | string>("");
  const [cadera, setCadera] = useState<number | string>("");
  const [entrepierna, setEntrepierna] = useState<number | string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const validarMedidas = () => {
    if (+altura < 100 || +altura <= 0) {
      alert("La altura debe ser al menos 100 cm y no puede ser negativa.");
      return false;
    }
    if (+cuelloManga < 25 || +cuelloManga <= 0) {
      alert("El cuello/manga debe ser al menos 25 cm y no puede ser negativa.");
      return false;
    }
    if (+pecho < 60 || +pecho <= 0) {
      alert("El pecho debe ser al menos 60 cm y no puede ser negativo.");
      return false;
    }
    if (+cintura < 50 || +cintura <= 0) {
      alert("La cintura debe ser al menos 50 cm y no puede ser negativa.");
      return false;
    }
    if (+cadera < 50 || +cadera <= 0) {
      alert("La cadera debe ser al menos 50 cm y no puede ser negativa.");
      return false;
    }
    if (+entrepierna < 50 || +entrepierna <= 0) {
      alert("La entrepierna debe ser al menos 50 cm y no puede ser negativa.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarMedidas()) {
      return;
    }

    const newUser: Omit<Usuario, "id"> = {
      nombre,
      email,
      password,
      altura: +altura,
      cuelloManga: +cuelloManga,
      pecho: +pecho,
      cintura: +cintura,
      cadera: +cadera,
      entrepierna: +entrepierna,
    };

    const result = await createUsuario(newUser);

    if (typeof result === "string") {
      setError(result);
    } else {
      setNombre("");
      setEmail("");
      setPassword("");
      setAltura("");
      setCuelloManga("");
      setPecho("");
      setCintura("");
      setCadera("");
      setEntrepierna("");
      setError(null);
      navigate("/welcome");
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

      <div className="logo">
        <img
          src={logo}
          alt="Logo"
          style={{
            height: 150,
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: 0.5,
          }}
        />
      </div>

      <Stack
        sx={{
          marginTop: { xs: 0, sm: "100px" },
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
            UNETE A VUMMY
          </Typography>
        </Box>
        <Box
          sx={{
            textAlign: "center",
            maxWidth: "90%",
            margin: "0 auto",
            marginBottom: 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "0.9rem", sm: "1rem" },
              color: "gray",
            }}
          >
            Es necesario que ingrese sus medidas para poder brindarle una mejor
            experiencia en la app.
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={3}
          >
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              gap={2}
              justifyContent="center"
            >
              <TextField
                fullWidth
                label="Username"
                variant="filled"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  width: { xs: "100%", sm: "250px" },
                }}
              />
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
                  width: { xs: "100%", sm: "250px" },
                }}
              />
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
                  width: { xs: "100%", sm: "250px" },
                }}
              />
            </Box>

            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              gap={2}
              justifyContent="center"
            >
              <TextField
                fullWidth
                label="Altura (cm)"
                variant="filled"
                type="number"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                required
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  width: { xs: "100%", sm: "250px" },
                }}
              />
              <TextField
                fullWidth
                label="Cuello/Manga (cm)"
                variant="filled"
                type="number"
                value={cuelloManga}
                onChange={(e) => setCuelloManga(e.target.value)}
                required
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  width: { xs: "100%", sm: "250px" },
                }}
              />
              <TextField
                fullWidth
                label="Pecho (cm)"
                variant="filled"
                type="number"
                value={pecho}
                onChange={(e) => setPecho(e.target.value)}
                required
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  width: { xs: "100%", sm: "250px" },
                }}
              />
            </Box>

            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              gap={2}
              justifyContent="center"
            >
              <TextField
                fullWidth
                label="Cintura (cm)"
                variant="filled"
                type="number"
                value={cintura}
                onChange={(e) => setCintura(e.target.value)}
                required
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  width: { xs: "100%", sm: "250px" },
                }}
              />
              <TextField
                fullWidth
                label="Cadera (cm)"
                variant="filled"
                type="number"
                value={cadera}
                onChange={(e) => setCadera(e.target.value)}
                required
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  width: { xs: "100%", sm: "250px" },
                }}
              />
              <TextField
                fullWidth
                label="Entrepierna (cm)"
                variant="filled"
                type="number"
                value={entrepierna}
                onChange={(e) => setEntrepierna(e.target.value)}
                required
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  width: { xs: "100%", sm: "250px" },
                }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#2196F3",
                color: "#fff",
                width: "100%",
                padding: "10px",
                fontSize: "1.1rem",
                "&:hover": {
                  backgroundColor: "#1976D2",
                },
                borderRadius: "8px",
              }}
            >
              REGISTRATE
            </Button>
          </Box>
        </form>
      </Stack>
    </>
  );
};
