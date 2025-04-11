import { Box, Stack } from "@mui/joy";
import logo from "../assets/VummyLogo_Azul.png";
import logoDiamante from "../assets/VummyLogo_Azul_Diamante.png";
import { Title } from "../components/Title";
import { Layout } from "../components/Layout";

export const Mantenimiento = () => {
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
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <img src={logo} alt="Logo" style={{ height: 200 }} />
        </Box>
        <Stack sx={{ display: "flex", alignItems: "center" }}>
          <Title
            text="EN MANTENIMIENTO... "
            sizeXs="1.5rem"
            sizeMd="2rem"
            marginTop={0}
            paddingTop="20px"
          />
        </Stack>
      </Layout>
    </Stack>
  );
};
