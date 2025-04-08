import { Box, Stack } from "@mui/joy";
import logoDiamante from "../assets/VummyLogo_Azul_Diamante.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // faltaba importar
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface NavBarWhitArrow {
  arrow: true;
  path: string;
}

interface NavBarWhitoutArrow {
  arrow: false;
  path?: string;
}

type NavBarInterface = NavBarWhitArrow | NavBarWhitoutArrow;

export const NavBar = ({ arrow, path }: NavBarInterface) => {
  const navigate = useNavigate();

  return (
    <Stack
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "linear-gradient(to right, #222222 0%, #0077b6 100%)",
        color: "white",
        paddingY: 1.5,
        paddingX: 3,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {arrow && (
            <IconButton
              onClick={() => navigate(path!)}
              sx={{
                color: "gray",
                "&:hover": { color: "#fff" },
                padding: 0,
                minWidth: "auto",
                mr: 1,
              }}
            >
              <ArrowBackIcon sx={{ fontSize: { xs: 22, md: 28 } }} />
            </IconButton>
          )}
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
