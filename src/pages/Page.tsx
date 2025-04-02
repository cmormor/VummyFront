import { Box, Button, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import logo from "../assets/VummyLogo_Azul.png";

export const Page = () => {
  const navigate = useNavigate();

  return (
    <>
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
          level="h4"
          sx={{
            marginBottom: 2,
            fontFamily: "'Lexend Zetta', sans-serif",
            fontWeight: "200",
            fontSize: "2rem",
            color: "white",
          }}
        >
          EN MANTENIMIENTO...
        </Typography>
        <Button
          variant="solid"
          color="primary"
          onClick={() => navigate("/")}
          sx={{
            lineHeight: "1.5",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          DESCONECTARSE
        </Button>
      </Box>
    </>
  );
};
