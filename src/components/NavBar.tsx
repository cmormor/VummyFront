import { Box, Stack } from "@mui/joy";
import logoDiamante from "../assets/VummyLogo_Azul_Diamante.png";

export const NavBar = () => {
  return (
    <Stack
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "rgba(34, 34, 34, 0.7)",
        color: "white",
        paddingY: 1.5,
        paddingX: 3,
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src={logoDiamante}
            alt="Logo"
            style={{ height: 60, objectFit: "contain" }}
          />
        </Box>
      </Stack>
    </Stack>
  );
};
