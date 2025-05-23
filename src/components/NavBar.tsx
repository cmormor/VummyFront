import {
  Box,
  Stack,
  IconButton,
  Avatar,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Divider,
  Tooltip,
  Badge,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useThemeContext } from "../style/ThemeContext";
import logoDiamante from "/VummyLogo_Azul_Diamante.png";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import BrightnessLowIcon from "@mui/icons-material/BrightnessLow";
import { logoutUsuario, perfilUsuario } from "../api/userApi";
import { useState, useEffect } from "react";
import { Usuario } from "../types/user";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import InfoIcon from '@mui/icons-material/Info';
import StoreIcon from '@mui/icons-material/Store';
import { ModalConfirmation } from "./ModalConfirmation";
import { HomeFilled } from "@mui/icons-material";
import { getCartItems } from "../api/cart-items";

interface NavBarProps {
  recarga?: boolean;
}

export const NavBar = (recarga: NavBarProps) => {

  const navigate = useNavigate();
  const location = useLocation();
  const { toggleTheme, mode } = useThemeContext();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);

  const isDisabled =
    location.pathname === "/register" ||
    location.pathname === "/login" ||
    location.pathname === "/";

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isDisabled) {
        try {
          const data = await perfilUsuario();
          setUsuario(data);
        } catch (error) {
          console.error("Error al obtener el perfil del usuario:", error);
        }
      }
    };

    const fetchCart = async () => {
      if (!isDisabled) {
        try {
          const cartData = await getCartItems();
          setCartItemCount(cartData.length);
        } catch (error) {
          console.error("Error al obtener el carrito:", error);
        }
      }
    };

    fetchUserProfile();
    fetchCart();
  }, [isDisabled, recarga]);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logoutUsuario();
      setUsuario(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <Stack
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(26, 26, 26, 0.75)"
            : "rgba(255, 255, 255, 0.75)",
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
            style={{ height: 60, cursor: "pointer" }}
            onClick={() => {
              navigate(isDisabled ? "/" : "/home");
            }}
          />
        </Box>

        <Stack direction="row" alignItems="center" spacing={2}>
          <Tooltip title={mode === "dark" ? "Modo Claro" : "Modo Oscuro"}>
            <IconButton onClick={toggleTheme} color="inherit">
              {mode === "dark" ? (
                <BrightnessLowIcon sx={{ fontSize: 30 }} />
              ) : (
                <Brightness4Icon sx={{ fontSize: 30 }} />
              )}
            </IconButton>
          </Tooltip>

          {!isDisabled && (
            <>
              <Tooltip title="Tiendas">
                <IconButton onClick={() => navigate("/home")}>
                  <StoreIcon
                    sx={{
                      fontSize: 30,
                      color: (theme) =>
                        location.pathname === "/home"
                          ? theme.palette.primary.main
                          : "none",
                      borderBottom: (theme) =>
                        location.pathname === "/home"
                          ? `2px solid ${theme.palette.primary.main}`
                          : "none",
                    }}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title="Ver Carrito">
                <IconButton onClick={() => navigate("/shoppingcart")}>
                  <Badge
                    badgeContent={cartItemCount > 0 ? <InfoIcon sx={{ fontSize: 12 }} /> : null}
                    color="error"
                    overlap="circular"
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <ShoppingCartIcon
                      sx={{
                        fontSize: 30,
                        color: (theme) =>
                          location.pathname === "/shoppingcart"
                            ? theme.palette.primary.main
                            : "none",
                        borderBottom: (theme) =>
                          location.pathname === "/shoppingcart"
                            ? `2px solid ${theme.palette.primary.main}`
                            : "none",
                      }}
                    />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Mis Pedidos">
                <IconButton onClick={() => navigate("/orders")}>
                  <InventoryIcon
                    sx={{
                      fontSize: 30,
                      color: (theme) =>
                        location.pathname === "/orders"
                          ? theme.palette.primary.main
                          : "none",
                      borderBottom: (theme) =>
                        location.pathname === "/orders"
                          ? `2px solid ${theme.palette.primary.main}`
                          : "none",
                    }}
                  />
                </IconButton>
              </Tooltip>

              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: "divider" }}
              />

              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: (theme) => theme.palette.primary.main,
                  cursor: "pointer",
                }}
                onClick={handleAvatarClick}
              >
                {usuario?.nombre?.charAt(0).toUpperCase() || ""}
              </Avatar>
            </>
          )}
        </Stack>
      </Stack>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          elevation: 2,
          sx: {
            borderRadius: 2,
            overflow: "hidden",
            backgroundColor: (theme) => theme.palette.background.paper,
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0px 4px 20px rgba(0, 0, 0, 0.5)"
                : "0px 4px 20px rgba(0, 0, 0, 0.1)",
            padding: 0,
            minWidth: 220,
          },
        }}
      >
        <Box sx={{ padding: 2 }}>
          {usuario && (
            <>
              <Box
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color: (theme) => theme.palette.text.primary,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {usuario.nombre.toUpperCase()}
              </Box>
              <List>
                <Divider />

                <ListItem disablePadding sx={{ paddingY: 0.5 }}>
                  <ListItemButton
                    sx={{ paddingY: 1 }}
                    onClick={() => navigate("/settings/?opcion=Perfil")}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={usuario.email}
                      primaryTypographyProps={{
                        fontSize: "0.9rem",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                      sx={{
                        margin: 0,
                        marginTop: 0.5,
                        marginLeft: 0.5,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ paddingY: 0.5 }}>
                  <ListItemButton
                    sx={{ paddingY: 1 }}
                    onClick={() => navigate("/home")}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <HomeFilled />
                    </ListItemIcon>
                    <ListItemText
                      primary="Home"
                      primaryTypographyProps={{
                        fontSize: "0.9rem",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                      sx={{
                        margin: 0,
                        marginTop: 0.5,
                        marginLeft: 0.5,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ paddingY: 0.5 }}>
                  <ListItemButton
                    sx={{ paddingY: 1 }}
                    onClick={() => navigate("/settings")}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Ajustes"
                      primaryTypographyProps={{
                        fontSize: "0.9rem",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                      sx={{
                        margin: 0,
                        marginTop: 0.5,
                        marginLeft: 0.5,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ paddingY: 0.5 }}>
                  <ListItemButton
                    sx={{ paddingY: 1 }}
                    onClick={() => {
                      handleClosePopover();
                      setOpenModal(true);
                      setMensaje("¿Estás seguro de que deseas cerrar sesión?");
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Cerrar Sesión"
                      primaryTypographyProps={{
                        fontSize: "0.9rem",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                      sx={{
                        margin: 0,
                        marginTop: 0.5,
                        marginLeft: 0.5,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </>
          )}
        </Box>
      </Popover>

      <ModalConfirmation
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleLogout}
        mensaje={mensaje}
      />
    </Stack>
  );
};
