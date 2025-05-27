import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Stack } from "@mui/material";
import logo from "/VummyLogo_Azul.png";
import { Title } from "../../components/Title";
import { Layout } from "../../components/Layout";

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
      <Layout color>
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
            variant="body1"
            sx={{
              textAlign: "center",
              color: (theme) => theme.palette.text.primary,
              lineHeight: "1.5",
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            {/* En Vummy App, transformamos tu experiencia de compra online para
            siempre. Regístrate, ingresa tus medidas corporales y podrás ver
            cómo las prendas se ajustan a tu cuerpo a través de un maniquí 3D
            personalizado, evitando las incógnitas que a menudo acompañan a la
            compra online. Esta tecnología asegura que tus decisiones de talla
            sean siempre las correctas. Para mayor precisión, tus medidas se
            actualizarán cada tres meses, adaptándose a los cambios naturales en
            tu cuerpo. */}
            En Vummy App transformamos tu experiencia de compra online. Al registrarte, podrás ingresar tus medidas corporales y acceder a un sistema inteligente de recomendación de tallas, que compara tus medidas con las tallas disponibles en cada tienda. Así, podrás elegir la talla que mejor se adapta a ti, evitando dudas y reduciendo devoluciones.

            Para mantener la precisión del sistema, tus medidas se actualizarán cada tres meses, adaptándose a los cambios naturales de tu cuerpo.



          </Typography>

          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: (theme) => theme.palette.text.primary,
              lineHeight: "1.5",
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >Como mejora futura, se prevé incorporar un maniquí virtual 3D personalizado que permita visualizar cómo te quedarían las prendas, ofreciendo una experiencia aún más inmersiva y personalizada.</Typography>

          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: (theme) => theme.palette.text.primary,
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
              variant="contained"
              color="primary"
              onClick={() => navigate("/register")}
              sx={{
                width: { xs: "100%", md: "auto" },
                boxShadow: "none",
              }}
            >
              REGÍSTRATE
            </Button>
            <Button
              variant="outlined"
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
