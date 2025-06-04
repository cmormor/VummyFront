import {
  Box,
  Paper,
  alpha,
  Typography,
  Stack,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  IconButton,
} from "@mui/material";
import {
  SupportAgent,
  Email,
  Phone,
  CheckCircle,
  AccessTime,
  ExpandMore,
  Help,
} from "@mui/icons-material";

export const SuportSettings = () => {
  const faqItems = [
    {
      question: "¿Cómo puedo restablecer mi contraseña?",
      answer:
        "Ve a la página de inicio de sesión y haz clic en '¿Olvidaste tu contraseña?'. Otra opción es ir al apartado de ajustes y seleccionar 'Seguridad'.",
    },
    {
      question: "¿Cuáles son los horarios de soporte?",
      answer:
        "Nuestro chat está disponible 24/7. El soporte telefónico está disponible de lunes a viernes de 9:00 a 18:00 horas.",
    },
    {
      question: "¿Dónde puedo descargar la aplicación móvil?",
      answer: "Nuestra aplicación móvil está en proceso de desarrollo.",
    },
  ];

  const handleSupport = () => {
    window.open("mailto:soporte.vummy@gmail.com", "_blank");
  };

  return (
    <Box sx={{ mt: 2, maxWidth: 800, mx: "auto", px: 2 }}>
      <Paper
        elevation={4}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(
              theme.palette.info.light,
              0.08
            )} 0%, ${alpha(theme.palette.info.dark, 0.05)} 100%)`,
          border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
        }}
      >
        {/* Título */}
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            sx={{
              width: 33,
              height: 33,
              backgroundColor: (theme) => theme.palette.info.main,
              mr: 3,
            }}
          >
            <SupportAgent sx={{ fontSize: 25 }} />
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              fontWeight: 600,
              color: (theme) => theme.palette.info.main,
            }}
          >
            CENTRO DE SOPORTE
          </Typography>
        </Box>

        <Divider
          sx={{
            mb: 3,
            bgcolor: (theme) => alpha(theme.palette.info.main, 0.3),
            height: 2,
            borderRadius: 1,
          }}
        />

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "1.1rem", md: "1.3rem" },
            mb: 2,
          }}
        >
          Estamos aquí para ayudarte. Contáctanos por correo electrónico o
          mediante teléfono móvil.
        </Typography>

        {/* Contacto */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          flexWrap="wrap"
          sx={{ mb: 3 }}
        >
          {/* Email */}
          <List sx={{ width: { xs: "100%", sm: "auto" } }}>
            <ListItem sx={{ mb: 1, width: "100%" }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <IconButton
                  onClick={handleSupport}
                  sx={{
                    color: (theme) => theme.palette.info.main,
                    border: (theme) => `solid 1px ${theme.palette.info.main}`,
                  }}
                >
                  <Email />
                </IconButton>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      wordBreak: "break-all",
                      color: "text.primary",
                      cursor: "pointer",
                    }}
                    onClick={handleSupport}
                  >
                    soporte.vummy@gmail.com
                  </Typography>
                }
                secondary="Correo de contacto"
                sx={{ ml: 1.5 }}
              />
            </ListItem>
          </List>

          {/* Teléfono */}
          <List sx={{ width: { xs: "100%", sm: "auto" } }}>
            <ListItem sx={{ mb: 1, width: "100%" }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Phone color="info" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: "text.primary",
                    }}
                  >
                    +1 (555) 123-4567
                  </Typography>
                }
                secondary="Lun-Vie 9:00-18:00"
              />
            </ListItem>
          </List>
        </Stack>

        {/* Chips visibles */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          useFlexGap
          flexWrap="wrap"
          mb={2}
        >
          <Chip
            icon={<CheckCircle />}
            label="Todos los servicios operativos"
            color="success"
            variant="outlined"
            sx={{
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "default",
            }}
          />
          <Chip
            icon={<AccessTime />}
            label="Tiempo de respuesta promedio: 3 min"
            color="warning"
            variant="outlined"
            sx={{
              fontSize: "0.875rem",
              cursor: "default",
            }}
          />
        </Stack>
      </Paper>

      {/* Sección de FAQ */}
      <Box sx={{ flex: 1, minWidth: { xs: "100%", md: "300px" } }}>
        <Stack spacing={3}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(
                  theme.palette.info.light,
                  0.08
                )} 0%, ${alpha(theme.palette.info.light, 0.05)} 100%)`,
              border: (theme) =>
                `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <Help
                sx={{
                  mr: 2,
                  color: (theme) => theme.palette.info.main,
                  fontSize: "1.8rem",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: {
                    xs: "1.1rem",
                    md: "1.3rem",
                  },
                  fontWeight: 600,
                  color: (theme) => theme.palette.info.main,
                }}
              >
                PREGUNTAS FRECUENTES
              </Typography>
            </Box>

            <Divider
              sx={{
                mb: 3,
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.3),
                height: 2,
                borderRadius: 1,
              }}
            />

            {faqItems.map((item, index) => (
              <Accordion
                key={index}
                elevation={0}
                sx={{
                  background: "transparent",
                  "&:before": { display: "none" },
                  mb: 1,
                  width: "100%",
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
};
