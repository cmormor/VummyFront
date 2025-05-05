import type React from "react";

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
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Person,
  Security,
  Language,
  Help,
  ChevronRight,
} from "@mui/icons-material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { NavBar } from "../../components/NavBar";
import { Title } from "../../components/Title";
import { Layout } from "../../components/Layout";
import { useSearchParams } from "react-router-dom";

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

export const Settings = () => {
  const [searchParams] = useSearchParams();
  const opcionURL = searchParams.get("opcion") || "General";
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(opcionURL);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const isMobile = useMobile();

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

  const menuOptions: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: "General", label: "General", icon: <SettingsIcon /> },
    { id: "Perfil", label: "Perfil", icon: <Person /> },
    { id: "Seguridad", label: "Seguridad", icon: <Security /> },
    { id: "Idioma", label: "Idioma", icon: <Language /> },
    { id: "Ayuda", label: "Ayuda", icon: <Help /> },
  ];

  const backToList = () => {
    setMostrarDetalle(false);
  };

  const renderContenido = () => {
    const textProps = {
      fontFamily: "'Poppins', sans-serif",
      fontSize: { xs: "0.9rem", md: "1rem" },
    };

    switch (opcionSeleccionada) {
      case "General":
        return (
          <Box>
            {isMobile ? (
              <Box display="flex" alignItems="flex-start">
                {isMobile && (
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={backToList}
                    sx={{ mt: -0.5 }}
                  >
                    <ArrowBackIosIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                )}
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    fontFamily: "'Lexend Zetta', sans-serif",
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                  }}
                >
                  AJUSTES GENERALES
                </Typography>
              </Box>
            ) : (
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontFamily: "'Lexend Zetta', sans-serif",
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                }}
              >
                AJUSTES GENERALES
              </Typography>
            )}

            <Divider sx={{ mb: { xs: 2, md: 3 } }} />
            <Typography variant="body1" sx={textProps}>
              Configura los ajustes generales de tu aplicación. Aquí puedes
              personalizar las opciones básicas y el comportamiento
              predeterminado.
            </Typography>
          </Box>
        );

      case "Perfil":
        return (
          <Box>
            {isMobile ? (
              <Box display="flex" alignItems="flex-start">
                {isMobile && (
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={backToList}
                    sx={{ mt: -0.5 }}
                  >
                    <ArrowBackIosIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                )}
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    fontFamily: "'Lexend Zetta', sans-serif",
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                  }}
                >
                  PERFIL
                </Typography>
              </Box>
            ) : (
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontFamily: "'Lexend Zetta', sans-serif",
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                }}
              >
                PERFIL
              </Typography>
            )}

            <Divider sx={{ mb: { xs: 2, md: 3 } }} />
            <Typography variant="body1" sx={textProps}>
              Personaliza tu información de perfil, foto de usuario y
              preferencias personales.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1.5, sm: 2 }}
              sx={{ mt: { xs: 1.5, md: 2 } }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 2, md: 3 },
                  flex: 1,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: { xs: 130, md: 150 },
                }}
              >
                <Person
                  sx={{
                    fontSize: { xs: 32, md: 40 },
                    color: (theme) => theme.palette.primary.main,
                    mb: 1,
                  }}
                />
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  gutterBottom
                  sx={{
                    ...textProps,
                    fontSize: { xs: "0.95rem", md: "1rem" },
                  }}
                >
                  Información personal
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    ...textProps,
                    fontSize: { xs: "0.8rem", md: "0.875rem" },
                    textAlign: "center",
                  }}
                >
                  Actualiza tu nombre, correo electrónico y otra información de
                  contacto.
                </Typography>
              </Paper>
            </Stack>
          </Box>
        );

      case "Seguridad":
        return (
          <Box>
            {isMobile ? (
              <Box display="flex" alignItems="flex-start">
                {isMobile && (
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={backToList}
                    sx={{ mt: -0.5 }}
                  >
                    <ArrowBackIosIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                )}
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    fontFamily: "'Lexend Zetta', sans-serif",
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                  }}
                >
                  SEGURIDAD
                </Typography>
              </Box>
            ) : (
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontFamily: "'Lexend Zetta', sans-serif",
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                }}
              >
                AJUSTES DE SEGURIDAD
              </Typography>
            )}
            <Divider sx={{ mb: { xs: 2, md: 3 } }} />
            <Typography variant="body1" sx={textProps}>
              Gestiona tu contraseña y opciones de seguridad de la cuenta.
            </Typography>
          </Box>
        );

      case "Idioma":
        return (
          <Box>
            {isMobile ? (
              <Box display="flex" alignItems="flex-start">
                {isMobile && (
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={backToList}
                    sx={{ mt: -0.5 }}
                  >
                    <ArrowBackIosIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                )}
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    fontFamily: "'Lexend Zetta', sans-serif",
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                  }}
                >
                  IDIOMA
                </Typography>
              </Box>
            ) : (
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontFamily: "'Lexend Zetta', sans-serif",
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                }}
              >
                IDIOMA
              </Typography>
            )}
            <Divider sx={{ mb: { xs: 2, md: 3 } }} />
            <Typography variant="body1" sx={textProps}>
              Cambia el idioma de la aplicación.
            </Typography>
          </Box>
        );

      case "Ayuda":
        return (
          <Box>
            {isMobile ? (
              <Box display="flex" alignItems="flex-start">
                {isMobile && (
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={backToList}
                    sx={{ mt: -0.5 }}
                  >
                    <ArrowBackIosIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                )}
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    fontFamily: "'Lexend Zetta', sans-serif",
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                  }}
                >
                  AYUDA Y SOPORTE
                </Typography>
              </Box>
            ) : (
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontFamily: "'Lexend Zetta', sans-serif",
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                }}
              >
                AYUDA Y SOPORTE
              </Typography>
            )}

            <Divider sx={{ mb: { xs: 2, md: 3 } }} />
            <Typography variant="body1" sx={textProps}>
              Encuentra respuestas a tus preguntas y obtén soporte.
            </Typography>
          </Box>
        );
      default:
        return (
          <Box>
            <Typography variant="body1" {...textProps}>
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
                p: 2,
                bgcolor: (theme) => theme.palette.primary.main,
                color: "white",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Menú de Opciones
              </Typography>
            </Box>
            <List sx={{ bgcolor: "background.paper", pt: 0 }}>
              {menuOptions.map((option) => (
                <ListItemButton
                  key={option.id}
                  onClick={() => handleSeleccionarOpcion(option.id)}
                  sx={(theme) => ({
                    py: 2,
                    borderBottom: `1px solid ${alpha(
                      theme.palette.divider,
                      0.5
                    )}`,
                  })}
                >
                  <ListItemIcon
                    sx={{
                      color: (theme) => theme.palette.primary.main,
                      minWidth: 40,
                    }}
                  >
                    {option.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={option.label}
                    primaryTypographyProps={{
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  />
                  <ChevronRight color="action" />
                </ListItemButton>
              ))}
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
            <Box sx={{ p: 2, bgcolor: "background.paper" }}>
              {renderContenido()}
            </Box>
          </Box>
        </Slide>
      </>
    );
  };

  const renderDesktop = () => {
    return (
      <Stack
        direction="row"
        spacing={3}
        sx={{
          width: "100%",
          mt: 5,
          px: 2,
          pb: 4,
        }}
      >
        <Paper
          elevation={2}
          sx={{
            width: "250px",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 2,
              bgcolor: (theme) => theme.palette.primary.main,
              color: "white",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="medium"
              sx={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Menú de Opciones
            </Typography>
          </Box>
          <List component="nav" sx={{ p: 1 }}>
            {menuOptions.map((option) => (
              <ListItemButton
                key={option.id}
                selected={opcionSeleccionada === option.id}
                onClick={() => setOpcionSeleccionada(option.id)}
                sx={(theme) => ({
                  borderRadius: 1.5,
                  mb: 0.5,
                  py: 1,
                  "&.Mui-selected": {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                    },
                    "& .MuiListItemIcon-root": {
                      color: theme.palette.primary.main,
                    },
                  },
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                })}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{option.icon}</ListItemIcon>
                <ListItemText
                  primary={option.label}
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "1rem",
                    },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            flexGrow: 1,
            p: 3,
            borderRadius: 2,
            height: 600,
            width: "100%",
            overflow: "auto",
          }}
        >
          <Box>{renderContenido()}</Box>
        </Paper>
      </Stack>
    );
  };

  return (
    <>
      <NavBar />
      <Layout>
        <Title text="AJUSTES" marginTop={50} paddingTop="0px" />
        {isMobile ? (
          <Box sx={{ px: 2, py: 2, width: "100%" }}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                width: "100%",
                position: "relative",
                minHeight: 400,
                backgroundColor: "transparent",
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
