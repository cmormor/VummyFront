import { Box, Button, Stack } from "@mui/material";
import logo from "/VummyLogo_Azul.png";
import { Title } from "./Title";
import { Layout } from "./Layout";
import { useNavigate } from "react-router-dom";

export const Maintenance = () => {
  const navigate = useNavigate();
  return (
    <>
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <img src={logo} alt="Logo" style={{ height: 150 }} />
        </Box>
        <Stack sx={{ display: "flex", alignItems: "center" }}>
          <Title
            text="EN MANTENIMIENTO"
            sizeXs="1.5rem"
            sizeMd="2rem"
            marginTop={0}
            paddingTop="20px"
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/home")}
          >
            VOLVER AL INICIO
          </Button>
        </Stack>
      </Layout>
    </>
  );
};
