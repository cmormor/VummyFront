import { useState, useEffect } from "react";
import {
  Stack,
  Box,
  Paper,
  Typography,
  Divider,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  alpha,
  IconButton,
  Slide,
  Skeleton,
} from "@mui/material";
import {
  Person,
  Security,
  Help,
  ChevronRight,
  Accessibility,
  GroupAdd,
  AddBusiness,
  LocalOffer,
  PostAdd,
} from "@mui/icons-material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Title } from "../../components/Title";
import { Layout } from "../../components/Layout";
import { useSearchParams } from "react-router-dom";
import { ProfileSettings } from "./ProfileSettings";
import { SecuritySettings } from "./SecuritySettings";
import { SuportSettings } from "./SuportSettings";
import { ManiquieViewSettings } from "./ManiquieViewSettings";
import { getRol } from "../../api/userApi";
import { UsersSettings } from "./UsersSettings";
import { StoresSettings } from "./StoresSettings";
import { ClotheSettings } from "./ClotheSettings";
import { OrdersSettings } from "./OrdersSettings";

const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const MenuItemSkeleton = ({ isMobile = false }) => (
  <ListItemButton
    disabled
    sx={{
      py: isMobile ? 2.5 : 1.5,
      px: isMobile ? 3 : 2,
      mb: isMobile ? 0 : 1,
      borderRadius: isMobile ? 0 : 2,
    }}
  >
    <ListItemIcon sx={{ minWidth: isMobile ? 50 : 45 }}>
      <Skeleton variant="circular" width={24} height={24} />
    </ListItemIcon>
    <ListItemText
      primary={<Skeleton variant="text" width="60%" height={24} />}
    />
    {isMobile && <Skeleton variant="circular" width={20} height={20} />}
  </ListItemButton>
);

export const Settings = () => {
  const [searchParams] = useSearchParams();
  const opcionURL = searchParams.get("opcion") || "Perfil";
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(opcionURL);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [rol, setRol] = useState("");
  const [loadingRol, setLoadingRol] = useState(true);
  const isMobile = useMobile();

  useEffect(() => {
    const opcionURL = searchParams.get("opcion") || "Perfil";
    setOpcionSeleccionada(opcionURL);
  }, [searchParams]);

  useEffect(() => {
    const obtenerRol = async () => {
      try {
        setLoadingRol(true);
        const rolObtenido = await getRol();
        setRol(rolObtenido);
      } catch (error) {
        console.error("Error al obtener el rol:", error);
        setRol("");
      } finally {
        setLoadingRol(false);
      }
    };
    obtenerRol();
  }, []);

  const handleSeleccionarOpcion = (opcion: string) => {
    if (isMobile) {
      setMostrarDetalle(true);
      setTimeout(() => {
        setOpcionSeleccionada(opcion);
      }, 50);
    } else {
      setOpcionSeleccionada(opcion);
    }
  };

  const baseMenuOptions = [
    { id: "Perfil", label: "Perfil", icon: <Person /> },
    { id: "Maniqui", label: "Maniqui", icon: <Accessibility /> },
    { id: "Seguridad", label: "Seguridad", icon: <Security /> },
  ];

  const adminMenuOptions = [
    { id: "Usuarios", label: "Usuarios", icon: <GroupAdd /> },
    { id: "Tiendas", label: "Tiendas", icon: <AddBusiness /> },
    { id: "Prendas", label: "Prendas", icon: <LocalOffer /> },
    { id: "Pedidos", label: "Pedidos", icon: <PostAdd /> },
  ];

  const supportOption = { id: "Soporte", label: "Soporte", icon: <Help /> };

  const backToList = () => {
    setMostrarDetalle(false);
  };

  const renderContenido = () => {
    const textProps = {
      fontFamily: "'Poppins', sans-serif",
      fontSize: { xs: "1rem", md: "1.4rem" },
      color: "text.primary",
    };

    const titleProps = {
      fontFamily: "'Lexend Zetta', sans-serif",
      fontSize: { xs: "1.2rem", md: "1.5rem" },
      fontWeight: "bold",
      color: "text.primary",
    };

    switch (opcionSeleccionada) {
      case "Perfil":
        return (
          <Box
            sx={{
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.light,
                  0.05
                )} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
              borderRadius: 3,
              p: 3,
              border: (theme) =>
                `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            {isMobile ? (
              <Box display="flex" alignItems="center" mb={3}>
                <IconButton
                  edge="start"
                  onClick={backToList}
                  sx={{
                    mr: 2,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    color: (theme) => theme.palette.primary.main,
                    "&:hover": {
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                >
                  <ArrowBackIosIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <Typography sx={titleProps}>PERFIL DE USUARIO</Typography>
              </Box>
            ) : (
              <Typography
                sx={{
                  ...titleProps,
                  color: (theme) => theme.palette.primary.main,
                }}
              >
                PERFIL DE USUARIO
              </Typography>
            )}

            <Divider
              sx={{
                mb: 3,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                height: 2,
                borderRadius: 1,
              }}
            />
            <Typography
              variant="body1"
              sx={{
                ...textProps,
                color: (theme) => theme.palette.text.secondary,
                mb: 3,
              }}
            >
              ¡ Actualiza tus datos personales y medias !
            </Typography>
            <ProfileSettings />
          </Box>
        );

      case "Maniqui":
        return (
          <Box
            sx={{
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(
                  theme.palette.info.light,
                  0.05
                )} 0%, ${alpha(theme.palette.info.light, 0.05)} 100%)`,
              borderRadius: 3,
              p: 3,
              border: (theme) =>
                `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
            }}
          >
            {isMobile ? (
              <Box display="flex" alignItems="center" mb={3}>
                <IconButton
                  edge="start"
                  onClick={backToList}
                  sx={{
                    mr: 2,
                    bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                    color: (theme) => theme.palette.info.main,
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.info.main, 0.2),
                    },
                  }}
                >
                  <ArrowBackIosIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <Typography
                  sx={{
                    ...titleProps,
                    color: (theme) => theme.palette.info.main,
                  }}
                >
                  VISTA MANIQUÍ
                </Typography>
              </Box>
            ) : (
              <Typography
                sx={{
                  ...titleProps,
                  color: (theme) => theme.palette.info.main,
                }}
              >
                VISTA MANIQUÍ
              </Typography>
            )}

            <Divider
              sx={{
                mb: 3,
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.3),
                height: 2,
                borderRadius: 1,
              }}
            />
            <Typography variant="body1" sx={textProps}>
              Visualiza tu maniquí desde todas las perspectivas.
            </Typography>
            <ManiquieViewSettings />
          </Box>
        );

      case "Seguridad":
        return (
          <Box
            sx={{
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(
                  theme.palette.error.light,
                  0.05
                )} 0%, ${alpha(theme.palette.info.light, 0.05)} 100%)`,
              borderRadius: 3,
              p: 3,
              border: (theme) =>
                `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
            }}
          >
            {isMobile ? (
              <Box display="flex" alignItems="center" mb={3}>
                <IconButton
                  edge="start"
                  onClick={backToList}
                  sx={{
                    mr: 2,
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                    color: (theme) => theme.palette.error.main,
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.error.main, 0.2),
                    },
                  }}
                >
                  <ArrowBackIosIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <Typography
                  sx={{
                    ...titleProps,
                    color: (theme) => theme.palette.error.main,
                  }}
                >
                  SEGURIDAD
                </Typography>
              </Box>
            ) : (
              <Typography
                sx={{
                  ...titleProps,
                  color: (theme) => theme.palette.error.main,
                }}
              >
                AJUSTES DE SEGURIDAD
              </Typography>
            )}

            <Divider
              sx={{
                mb: 3,
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.3),
                height: 2,
                borderRadius: 1,
              }}
            />
            <Typography variant="body1" sx={textProps}>
              Gestiona tu contraseña y opciones de seguridad de la cuenta.
            </Typography>
            <SecuritySettings />
          </Box>
        );

      case "Usuarios":
        return (
          <Box
            sx={{
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(
                  theme.palette.info.light,
                  0.05
                )} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
              borderRadius: 3,
              p: 3,
              border: (theme) =>
                `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
            }}
          >
            {isMobile ? (
              <Box display="flex" alignItems="center" mb={3}>
                <IconButton
                  edge="start"
                  onClick={backToList}
                  sx={{
                    mr: 2,
                    bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                    color: (theme) => theme.palette.info.main,
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.info.main, 0.2),
                    },
                  }}
                >
                  <ArrowBackIosIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <Typography
                  sx={{
                    ...titleProps,
                    color: (theme) => theme.palette.info.main,
                  }}
                >
                  GESTIÓN DE USUARIOS
                </Typography>
              </Box>
            ) : (
              <Typography
                sx={{
                  ...titleProps,
                  color: (theme) => theme.palette.info.main,
                }}
              >
                GESTIÓN DE USUARIOS
              </Typography>
            )}

            <Divider
              sx={{
                mb: 3,
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.3),
                height: 2,
                borderRadius: 1,
              }}
            />
            <UsersSettings />
          </Box>
        );

      case "Tiendas":
        return (
          <Box
            sx={{
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(
                  theme.palette.info.light,
                  0.05
                )} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
              borderRadius: 3,
              p: 3,
              border: (theme) =>
                `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
            }}
          >
            {isMobile ? (
              <Box display="flex" alignItems="center" mb={3}>
                <IconButton
                  edge="start"
                  onClick={backToList}
                  sx={{
                    mr: 2,
                    bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                    color: (theme) => theme.palette.info.main,
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.info.main, 0.2),
                    },
                  }}
                >
                  <ArrowBackIosIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <Typography
                  sx={{
                    ...titleProps,
                    color: (theme) => theme.palette.info.main,
                  }}
                >
                  GESTIÓN DE TIENDAS
                </Typography>
              </Box>
            ) : (
              <Typography
                sx={{
                  ...titleProps,
                  color: (theme) => theme.palette.info.main,
                }}
              >
                GESTIÓN DE TIENDAS
              </Typography>
            )}

            <Divider
              sx={{
                mb: 3,
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.3),
                height: 2,
                borderRadius: 1,
              }}
            />
            <StoresSettings />
          </Box>
        );

      case "Prendas":
        return (
          <Box
            sx={{
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(
                  theme.palette.info.light,
                  0.05
                )} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
              borderRadius: 3,
              p: 3,
              border: (theme) =>
                `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
            }}
          >
            {isMobile ? (
              <Box display="flex" alignItems="center" mb={3}>
                <IconButton
                  edge="start"
                  onClick={backToList}
                  sx={{
                    mr: 2,
                    bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                    color: (theme) => theme.palette.info.main,
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.info.main, 0.2),
                    },
                  }}
                >
                  <ArrowBackIosIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <Typography
                  sx={{
                    ...titleProps,
                    color: (theme) => theme.palette.info.main,
                  }}
                >
                  GESTIÓN DE PRENDAS
                </Typography>
              </Box>
            ) : (
              <Typography
                sx={{
                  ...titleProps,
                  color: (theme) => theme.palette.info.main,
                }}
              >
                GESTIÓN DE PRENDAS
              </Typography>
            )}

            <Divider
              sx={{
                mb: 3,
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.3),
                height: 2,
                borderRadius: 1,
              }}
            />
            <ClotheSettings />
          </Box>
        );

      case "Pedidos":
        return (
          <Box
            sx={{
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(
                  theme.palette.info.light,
                  0.05
                )} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
              borderRadius: 3,
              p: 3,
              border: (theme) =>
                `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
            }}
          >
            {isMobile ? (
              <Box display="flex" alignItems="center" mb={3}>
                <IconButton
                  edge="start"
                  onClick={backToList}
                  sx={{
                    mr: 2,
                    bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                    color: (theme) => theme.palette.info.main,
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.info.main, 0.2),
                    },
                  }}
                >
                  <ArrowBackIosIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <Typography
                  sx={{
                    ...titleProps,
                    color: (theme) => theme.palette.info.main,
                  }}
                >
                  GESTIÓN DE PEDIDOS
                </Typography>
              </Box>
            ) : (
              <Typography
                sx={{
                  ...titleProps,
                  color: (theme) => theme.palette.info.main,
                }}
              >
                GESTIÓN DE PEDIDOS
              </Typography>
            )}

            <Divider
              sx={{
                mb: 3,
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.3),
                height: 2,
                borderRadius: 1,
              }}
            />
            <OrdersSettings />
          </Box>
        );

      case "Soporte":
        return (
          <Box
            sx={{
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(
                  theme.palette.info.light,
                  0.05
                )} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
              borderRadius: 3,
              p: 3,
              border: (theme) =>
                `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
            }}
          >
            {isMobile ? (
              <Box display="flex" alignItems="center" mb={3}>
                <IconButton
                  edge="start"
                  onClick={backToList}
                  sx={{
                    mr: 2,
                    bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                    color: (theme) => theme.palette.info.main,
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.info.main, 0.2),
                    },
                  }}
                >
                  <ArrowBackIosIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <Typography
                  sx={{
                    ...titleProps,
                    color: (theme) => theme.palette.info.main,
                  }}
                >
                  AYUDA Y SOPORTE
                </Typography>
              </Box>
            ) : (
              <Typography
                sx={{
                  ...titleProps,
                  color: (theme) => theme.palette.info.main,
                }}
              >
                AYUDA Y SOPORTE
              </Typography>
            )}

            <Divider
              sx={{
                mb: 3,
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.3),
                height: 2,
                borderRadius: 1,
              }}
            />
            <Typography variant="body1" sx={textProps}>
              Encuentra respuestas a tus preguntas y obtén soporte técnico
              especializado. Nuestro equipo está aquí para ayudarte en todo
              momento.
            </Typography>
            <SuportSettings />
          </Box>
        );

      default:
        return (
          <Box
            sx={{
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(
                  theme.palette.grey[300],
                  0.1
                )} 0%, ${alpha(theme.palette.grey[200], 0.1)} 100%)`,
              borderRadius: 3,
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="body1" sx={textProps}>
              Selecciona una opción del menú
            </Typography>
          </Box>
        );
    }
  };

  const renderMobile = () => {
    return (
      <>
        <Slide
          direction="right"
          in={!mostrarDetalle}
          mountOnEnter
          unmountOnExit
          timeout={{ enter: 300, exit: 200 }}
        >
          <Box
            sx={{
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            <Box
              sx={{
                p: 3,
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: (theme) => theme.palette.primary.contrastText,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="600"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                  letterSpacing: "0.5px",
                }}
              >
                Menú de Ajustes
              </Typography>
            </Box>

            <List
              sx={{
                bgcolor: (theme) => theme.palette.background.paper,
                pt: 0,
                "& .MuiListItemButton-root": {
                  transition: "all 0.3s ease",
                },
              }}
            >
              {baseMenuOptions.map((option) => (
                <ListItemButton
                  key={option.id}
                  onClick={() => handleSeleccionarOpcion(option.id)}
                  sx={(theme) => ({
                    py: 2.5,
                    px: 3,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      transform: "translateX(8px)",
                    },
                  })}
                >
                  <ListItemIcon
                    sx={{
                      color: (theme) => theme.palette.primary.main,
                      minWidth: 50,
                      "& svg": {
                        fontSize: "1.4rem",
                      },
                    }}
                  >
                    {option.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={option.label}
                    primaryTypographyProps={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      fontWeight: 500,
                      color: "text.primary",
                    }}
                  />
                  <ChevronRight
                    sx={{
                      color: (theme) =>
                        alpha(theme.palette.text.secondary, 0.6),
                      transition: "transform 0.2s ease",
                    }}
                  />
                </ListItemButton>
              ))}

              {loadingRol ? (
                <>
                  <MenuItemSkeleton isMobile />
                  <MenuItemSkeleton isMobile />
                  <MenuItemSkeleton isMobile />
                  <MenuItemSkeleton isMobile />
                </>
              ) : (
                rol === "ADMINISTRADOR" &&
                adminMenuOptions.map((option) => (
                  <ListItemButton
                    key={option.id}
                    onClick={() => handleSeleccionarOpcion(option.id)}
                    sx={(theme) => ({
                      py: 2.5,
                      px: 3,
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        transform: "translateX(8px)",
                      },
                    })}
                  >
                    <ListItemIcon
                      sx={{
                        color: (theme) => theme.palette.primary.main,
                        minWidth: 50,
                        "& svg": {
                          fontSize: "1.4rem",
                        },
                      }}
                    >
                      {option.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={option.label}
                      primaryTypographyProps={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: { xs: "1rem", md: "1.1rem" },
                        fontWeight: 500,
                        color: "text.primary",
                      }}
                    />
                    <ChevronRight
                      sx={{
                        color: (theme) =>
                          alpha(theme.palette.text.secondary, 0.6),
                        transition: "transform 0.2s ease",
                      }}
                    />
                  </ListItemButton>
                ))
              )}

              <ListItemButton
                onClick={() => handleSeleccionarOpcion(supportOption.id)}
                sx={(theme) => ({
                  py: 2.5,
                  px: 3,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    transform: "translateX(8px)",
                  },
                })}
              >
                <ListItemIcon
                  sx={{
                    color: (theme) => theme.palette.primary.main,
                    minWidth: 50,
                    "& svg": {
                      fontSize: "1.4rem",
                    },
                  }}
                >
                  {supportOption.icon}
                </ListItemIcon>
                <ListItemText
                  primary={supportOption.label}
                  primaryTypographyProps={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    fontWeight: 500,
                    color: "text.primary",
                  }}
                />
                <ChevronRight
                  sx={{
                    color: (theme) => alpha(theme.palette.text.secondary, 0.6),
                    transition: "transform 0.2s ease",
                  }}
                />
              </ListItemButton>
            </List>
          </Box>
        </Slide>

        <Slide
          direction="left"
          in={mostrarDetalle}
          mountOnEnter
          unmountOnExit
          timeout={{ enter: 300, exit: 200 }}
        >
          <Box
            sx={{
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: (theme) => theme.palette.background.paper,
                minHeight: "100vh",
              }}
            >
              {renderContenido()}
            </Box>
          </Box>
        </Slide>
      </>
    );
  };

  const renderDesktop = () => {
    if (loadingRol) {
      return (
        <Stack
          direction="row"
          spacing={4}
          sx={{
            width: "100%",
            mt: 5,
            px: 3,
            pb: 4,
          }}
        >
          <Skeleton
            variant="rectangular"
            width={280}
            height={650}
            sx={{ borderRadius: 3 }}
          />

          <Skeleton
            variant="rectangular"
            sx={{ borderRadius: 3, flexGrow: 1, height: 650 }}
          />
        </Stack>
      );
    }

    return (
      <Stack
        direction="row"
        spacing={4}
        sx={{
          width: "100%",
          mt: 5,
          px: 3,
          pb: 4,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: "280px",
            borderRadius: 3,
            overflow: "hidden",
            background: (theme) =>
              `linear-gradient(145deg, ${theme.palette.background.paper
              } 0%, ${alpha(theme.palette.primary.light, 0.02)} 100%)`,
            border: (theme) =>
              `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Box
            sx={{
              p: 3,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: (theme) => theme.palette.primary.contrastText,
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: (theme) =>
                  `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.light} 100%)`,
              },
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="600"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                letterSpacing: "0.5px",
              }}
            >
              Menú de Ajustes
            </Typography>
          </Box>

          <List component="nav" sx={{ p: 2 }}>
            {baseMenuOptions.map((option) => (
              <ListItemButton
                key={option.id}
                selected={opcionSeleccionada === option.id}
                onClick={() => setOpcionSeleccionada(option.id)}
                sx={(theme) => ({
                  borderRadius: 2,
                  mb: 1,
                  py: 1.5,
                  px: 2,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&.Mui-selected": {
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                    transform: "translateX(8px)",
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.3
                    )}`,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.18),
                    },
                    "& .MuiListItemIcon-root": {
                      color: theme.palette.primary.main,
                      transform: "scale(1.1)",
                    },
                  },
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                    transform: "translateX(4px)",
                  },
                })}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 45,
                    transition: "transform 0.2s ease",
                    "& svg": {
                      fontSize: "1.3rem",
                    },
                  }}
                >
                  {option.icon}
                </ListItemIcon>
                <ListItemText
                  primary={option.label}
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "1.05rem",
                      fontWeight: 500,
                      transition: "font-weight 0.2s ease",
                    },
                  }}
                />
              </ListItemButton>
            ))}

            {rol === "ADMINISTRADOR" &&
              adminMenuOptions.map((option) => (
                <ListItemButton
                  key={option.id}
                  selected={opcionSeleccionada === option.id}
                  onClick={() => setOpcionSeleccionada(option.id)}
                  sx={(theme) => ({
                    borderRadius: 2,
                    mb: 1,
                    py: 1.5,
                    px: 2,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&.Mui-selected": {
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      color: theme.palette.primary.main,
                      transform: "translateX(8px)",
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.3
                      )}`,
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.18),
                      },
                      "& .MuiListItemIcon-root": {
                        color: theme.palette.primary.main,
                        transform: "scale(1.1)",
                      },
                    },
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.06),
                      transform: "translateX(4px)",
                    },
                  })}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 45,
                      transition: "transform 0.2s ease",
                      "& svg": {
                        fontSize: "1.3rem",
                      },
                    }}
                  >
                    {option.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={option.label}
                    primaryTypographyProps={{
                      sx: {
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "1.05rem",
                        fontWeight: 500,
                        transition: "font-weight 0.2s ease",
                      },
                    }}
                  />
                </ListItemButton>
              ))}

            <ListItemButton
              selected={opcionSeleccionada === supportOption.id}
              onClick={() => setOpcionSeleccionada(supportOption.id)}
              sx={(theme) => ({
                borderRadius: 2,
                mb: 1,
                py: 1.5,
                px: 2,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&.Mui-selected": {
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                  transform: "translateX(8px)",
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.18),
                  },
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.primary.main,
                    transform: "scale(1.1)",
                  },
                },
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.06),
                  transform: "translateX(4px)",
                },
              })}
            >
              <ListItemIcon
                sx={{
                  minWidth: 45,
                  transition: "transform 0.2s ease",
                  "& svg": {
                    fontSize: "1.3rem",
                  },
                }}
              >
                {supportOption.icon}
              </ListItemIcon>
              <ListItemText
                primary={supportOption.label}
                primaryTypographyProps={{
                  sx: {
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "1.05rem",
                    fontWeight: 500,
                    transition: "font-weight 0.2s ease",
                  },
                }}
              />
            </ListItemButton>
          </List>
        </Paper>

        <Paper
          elevation={8}
          sx={{
            flexGrow: 1,
            p: 4,
            borderRadius: 3,
            minHeight: 650,
            width: "100%",
            overflow: "auto",
            background: (theme) =>
              `linear-gradient(145deg, ${theme.palette.background.paper
              } 0%, ${alpha(theme.palette.primary.light, 0.01)} 100%)`,
            border: (theme) =>
              `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
          }}
        >
          <Box>{renderContenido()}</Box>
        </Paper>
      </Stack>
    );
  };

  return (
    <>
      <Layout>
        <Title text="AJUSTES" marginTop={50} paddingTop="0px" />
        {isMobile ? (
          <Box sx={{ px: 2, py: 2, width: "100%" }}>
            <Paper
              elevation={6}
              sx={{
                borderRadius: 3,
                overflow: "auto",
                width: "100%",
                position: "relative",
                minHeight: 500,
                background: (theme) =>
                  `linear-gradient(145deg, ${theme.palette.background.paper
                  } 0%, ${alpha(theme.palette.primary.light, 0.02)} 100%)`,
                border: (theme) =>
                  `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              {renderMobile()}
            </Paper>
          </Box>
        ) : (
          <>{renderDesktop()}</>
        )}
      </Layout>
    </>
  );
};
