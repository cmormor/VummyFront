import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Stack } from "@mui/joy";
import logo from "../../../public/VummyLogo_Azul.png";
import { Title } from "../../components/Title";
import { Layout } from "../../components/Layout";
import { NavBar } from "../../components/NavBar";

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <Stack
      sx={{
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <NavBar />
      <Layout>
        <Stack
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            flexDirection: "column",
            gap: { xs: 2, md: 3 },
            px: { xs: 2, md: 4 },
          }}
        >
          <Title
            text="DEJA DE IMAGINAR Y VIVE TU ESTILO"
            sizeXs="1.5rem"
            sizeMd="2rem"
            marginTop={80}
            paddingTop="0px"
          />

          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              maxHeight: { xs: 100, md: 140 },
              maxWidth: "70%",
            }}
          />

          <Typography
            level="body-lg"
            sx={{
              textAlign: "center",
              color: "lightgrey",
              lineHeight: "1.5",
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            En Vummy App, transformamos tu experiencia de compra online para
            siempre. Regístrate, ingresa tus medidas corporales y podrás ver
            cómo las prendas se ajustan a tu cuerpo a través de un maniquí 3D
            personalizado, evitando las incógnitas que a menudo acompañan a la
            compra online. Esta tecnología asegura que tus decisiones de talla
            sean siempre las correctas. Para mayor precisión, tus medidas se
            actualizarán cada tres meses, adaptándose a los cambios naturales en
            tu cuerpo.
          </Typography>

          <Typography
            level="body-lg"
            sx={{
              textAlign: "center",
              color: "lightgrey",
              lineHeight: "1.5",
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            ¡Haz de tus compras una experiencia más segura, rápida y cómoda con
            Vummy!
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "center",
              mt: 3,
            }}
          >
            <Button
              variant="solid"
              color="primary"
              onClick={() => navigate("/register")}
              sx={{ width: { xs: "100%", md: "auto" } }}
            >
              REGÍSTRATE
            </Button>
            <Button
              variant="soft"
              onClick={() => navigate("/login")}
              sx={{ width: { xs: "100%", md: "auto" } }}
            >
              INICIA SESIÓN
            </Button>
          </Box>
        </Stack>
      </Layout>
    </Stack>
  );
};
