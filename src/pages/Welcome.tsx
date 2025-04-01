import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import logo from "../assets/VummyLogo_Azul.png";

export const WelcomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/page");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <img src={logo} alt="Logo" style={{ height: 250 }} />
      </Box>
      <Typography
        variant="h4"
        sx={{
          marginBottom: 2,
          fontFamily: "'Lexend Zetta', sans-serif",
          fontWeight: "200",
          fontSize: "2rem",
        }}
      >
        ¡BIENVENIDO A VUMMY!
      </Typography>
      <Typography
        variant="h6"
        sx={{
          marginBottom: 4,
          lineHeight: "1.5",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Estás a punto de ser redirigido a la siguiente página...
      </Typography>
    </Box>
  );
};
