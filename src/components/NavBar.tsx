import { Box, Stack } from "@mui/joy";
import { IconButton } from "@mui/material";
import { useLocation } from "react-router-dom";
import logoDiamante from "../assets/VummyLogo_Azul_Diamante.png";
import { logoutUsuario } from "../api/userApi";
import LogoutIcon from "@mui/icons-material/Logout";

export const NavBar = () => {
  const location = useLocation();

  const isDisabled =
    location.pathname === "/register" || location.pathname === "/login";

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

        {!isDisabled && (
          <IconButton onClick={() => logoutUsuario()}>
            <LogoutIcon sx={{ color: "white", fontSize: { xs: 25, md: 30 } }} />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );
};
