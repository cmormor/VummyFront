import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Stack } from "@mui/joy";
import logo from "../assets/VummyLogo_Azul.png";
import logoDiamante from "../assets/VummyLogo_Azul_Diamante.png";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <Stack
      spacing={3}
      sx={{
        p: 3,
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #000000 70%, #0077b6 100%)",
        color: "white",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          width: "95%",
          p: 1,
          background: "linear-gradient(to right, #222222 0%, #0077b6 100%)",
          borderRadius: "8px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src={logoDiamante} alt="Logo" style={{ height: 60 }} />
        </Box>
        <Button
          variant="soft"
          onClick={() => navigate("/login")}
          sx={{ mr: 2 }}
        >
          Inicia Sesión
        </Button>
      </Stack>

      <Box sx={{ mt: 6 }}>
        <Typography
          level="h3"
          sx={{
            textAlign: "center",
            color: "lightgrey",
            fontFamily: "'Lexend Zetta', sans-serif",
            fontWeight: "200",
            fontSize: "2rem",
            m: 2,
            mb: 1,
          }}
        >
          DEJA DE IMAGINAR Y VIVE TU ESTILO
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <img src={logo} alt="Logo" style={{ height: 200 }} />
      </Box>

      <Typography
        level="body-lg"
        sx={{
          textAlign: "center",
          mt: 3,
          color: "lightgrey",
          width: "70%",
          lineHeight: "1.5",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        En Vummy App, transformamos tu experiencia de compra online para
        siempre. Solo regístrate, ingresa tus medidas corporales y podrás ver
        cómo las prendas se ajustan a tu cuerpo a través de un maniquí 3D
        personalizado, evitando las incógnitas que a menudo acompañan a la
        compra online. Esta tecnología asegura que tus decisiones de talla sean
        siempre las correctas. Además, para mayor precisión, tus medidas se
        actualizarán cada tres meses, adaptándose a los cambios naturales en tu
        cuerpo.
      </Typography>

      <Typography
        level="body-lg"
        sx={{
          textAlign: "center",
          mt: 3,
          color: "lightgrey",
          width: "100%",
          lineHeight: "1.5",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        ¡Haz de tus compras una experiencia más segura, rápida y cómoda con
        Vummy!
      </Typography>

      <Button
        variant="solid"
        color="primary"
        onClick={() => navigate("/register")}
        sx={{ mt: 4 }}
      >
        REGÍSTRATE
      </Button>
    </Stack>
  );
};
