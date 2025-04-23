import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h1" sx={{ fontSize: "4rem", marginBottom: 2 }}>
        404
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: 4 }}>
        La página que buscas no existe.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        sx={{ borderRadius: "8px" }}
      >
        Volver al inicio
      </Button>
    </Box>
  );
};
