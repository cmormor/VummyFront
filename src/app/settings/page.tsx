"use client";

import { useState } from "react";
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
  useTheme,
  alpha,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Person,
  Security,
  Language,
  Help,
} from "@mui/icons-material";
import { NavBar } from "../../components/NavBar";
import { Title } from "../../components/Title";
import { Layout } from "../../components/Layout";
import { useSearchParams } from "react-router-dom";

export const Settings = () => {
  const [searchParams] = useSearchParams();
  const opcionURL = searchParams.get("opcion") || "General";
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(opcionURL);
  const theme = useTheme();

  const menuOptions = [
    { id: "General", label: "General", icon: <SettingsIcon /> },
    { id: "Perfil", label: "Perfil", icon: <Person /> },
    { id: "Seguridad", label: "Seguridad", icon: <Security /> },
    { id: "Idioma", label: "Idioma", icon: <Language /> },
    { id: "Ayuda", label: "Ayuda", icon: <Help /> },
  ];

  const renderContenido = () => {
    const textProps = { fontFamily: "'Poppins', sans-serif" };

    switch (opcionSeleccionada) {
      case "General":
        return (
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontFamily: "'Lexend Zetta', sans-serif",
              }}
            >
              AJUSTES GENERALES
            </Typography>

            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1" {...textProps}>
              Configura los ajustes generales de tu aplicación. Aquí puedes
              personalizar las opciones básicas y el comportamiento
              predeterminado.
            </Typography>
          </Box>
        );
      case "Perfil":
        return (
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontFamily: "'Lexend Zetta', sans-serif",
              }}
            >
              PERFIL
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1" {...textProps}>
              Personaliza tu información de perfil, foto de usuario y
              preferencias personales.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 2 }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  flex: 1,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 150,
                }}
              >
                <Person
                  sx={{
                    fontSize: 40,
                    color: theme.palette.primary.main,
                    mb: 1,
                  }}
                />
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  gutterBottom
                  {...textProps}
                >
                  Información personal
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  {...textProps}
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
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontFamily: "'Lexend Zetta', sans-serif",
              }}
            >
              SEGURIDAD
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1" {...textProps}>
              Gestiona tu contraseña y opciones de seguridad de la cuenta.
            </Typography>
          </Box>
        );

      case "Idioma":
        return (
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontFamily: "'Lexend Zetta', sans-serif",
              }}
            >
              IDIOMA{" "}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1" {...textProps}>
              Cambia el idioma de la aplicación.
            </Typography>
          </Box>
        );
      case "Ayuda":
        return (
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontFamily: "'Lexend Zetta', sans-serif",
              }}
            >
              AYUDA Y SOPORTE
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1" {...textProps}>
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

  return (
    <>
      <NavBar />
      <Layout arrow>
        <Title text="AJUSTES" marginTop={20} paddingTop="0px" />
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          sx={{ width: "100%", mt: 5, px: 2, pb: 4 }}
        >
          <Paper
            elevation={2}
            sx={{
              width: { xs: "100%", md: "250px" },
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: theme.palette.primary.main,
                color: "white",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Menú de Ajustes
              </Typography>
            </Box>
            <List component="nav" sx={{ p: 1 }}>
              {menuOptions.map((option) => (
                <ListItemButton
                  key={option.id}
                  selected={opcionSeleccionada === option.id}
                  onClick={() => setOpcionSeleccionada(option.id)}
                  sx={{
                    borderRadius: 1.5,
                    mb: 0.5,
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
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {option.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={option.label}
                    primaryTypographyProps={{
                      sx: { fontFamily: "'Poppins', sans-serif" },
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
              width: "85%",
            }}
          >
            <Box>{renderContenido()}</Box>
          </Paper>
        </Stack>
      </Layout>
    </>
  );
};
