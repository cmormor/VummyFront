import { Box, Stack, IconButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useThemeContext } from "../style/ThemeContext";
import logoDiamante from "/VummyLogo_Azul_Diamante.png";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { logoutUsuario } from "../api/userApi";

export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleTheme, mode } = useThemeContext();

  const isDisabled =
    location.pathname === "/register" ||
    location.pathname === "/login" ||
    location.pathname === "/";

  return (
    <Stack
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: (theme) => theme.palette.background.default,
        color: (theme) => theme.palette.text.primary,
        paddingY: 1,
        paddingX: 3,
        borderBottom: (theme) =>
          theme.palette.mode === "dark"
            ? "1px solid rgba(255, 255, 255, 0.2)"
            : "1px solid rgba(0, 0, 0, 0.2)",
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
            style={{ height: 60, objectFit: "contain", cursor: "pointer" }}
            onClick={() => {
              if (isDisabled) {
                navigate("/");
              } else {
                navigate("/home");
              }
              window.location.reload();
            }}
          />
        </Box>

        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {!isDisabled && (
            <IconButton onClick={() => logoutUsuario()}>
              <LogoutIcon
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  fontSize: { xs: 25, md: 30 },
                }}
              />
            </IconButton>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
