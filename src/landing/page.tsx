import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Stack } from "@mui/joy";
import logo from "../assets/VummyLogo_Azul.png";
import logoDiamante from "../assets/VummyLogo_Azul_Diamante.png";
import { Title } from "../components/Title";

export const Landing = () => {
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
        paddingTop: "40px",
      }}
    >
      <Stack
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: "rgba(34, 34, 34, 0.7)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(8px)",
          color: "white",
          paddingY: 1.5,
          paddingX: 3,
          borderRadius: "5px",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src={logoDiamante} alt="Logo" style={{ height: 60 }} />
          </Box>
        </Stack>
      </Stack>

      <Title
        text="DEJA DE IMAGINAR Y VIVE TU ESTILO"
        sizeXs="1.5rem"
        sizeMd="2rem"
        marginTop={5}
        paddingTop="90px"
      />

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
        siempre. Regístrate, ingresa tus medidas corporales y podrás ver cómo
        las prendas se ajustan a tu cuerpo a través de un maniquí 3D
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
      <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
        <Button
          variant="solid"
          color="primary"
          onClick={() => navigate("/register")}
        >
          REGÍSTRATE
        </Button>
        <Button variant="soft" onClick={() => navigate("/login")}>
          INICIA SESIÓN
        </Button>
      </Box>
    </Stack>
  );
};
