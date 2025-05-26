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
    Tooltip,
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
            answer: "Ve a la página de inicio de sesión y haz clic en '¿Olvidaste tu contraseña?'. Otra opción es ir al apartado de ajustes y seleccionar 'Seguridad'"
        },
        {
            question: "¿Cuáles son los horarios de soporte?",
            answer: "Nuestro chat está disponible 24/7. El soporte telefónico está disponible de lunes a viernes de 9:00 a 18:00 horas."
        },
        {
            question: "¿Dónde puedo descargar la aplicación móvil?",
            answer: "Nuestra aplicación móvil esta en proceso de desarrollo."
        },
    ];

    const handleSupport = () => {
        window.open('mailto:soportevummyapp@gmail.com', '_blank')
    }

    return (
        <Box sx={{ mt: 2, maxWidth: 800 }}>
            <Paper
                elevation={4}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.info.light, 0.08)} 0%, ${alpha(theme.palette.info.dark, 0.05)} 100%)`,
                    border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                }}
            >
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

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" color="text.secondary" sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: { xs: "1.1rem", md: "1.3rem" },
                    }}>
                        Estamos aquí para ayudarte. Contactanos por correo electrónico o mediante télefono móvil.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={2} flexWrap="wrap">
                    <List>
                        <ListItem sx={{ mb: 1, ml: -2.5 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <Tooltip title="Contactar soporte técnico" arrow>
                                    <IconButton
                                        onClick={handleSupport}
                                        sx={{
                                            color: (theme) => theme.palette.info.main,
                                            border: (theme) => `solid 1px ${theme.palette.info.main}`
                                        }}
                                    >
                                        <Email />
                                    </IconButton>
                                </Tooltip>
                            </ListItemIcon>

                            <ListItemText
                                primary="soportevummyapp@gmail.com"
                                secondary="Email general"
                                sx={{ ml: 1.5 }}
                            />
                        </ListItem>
                    </List>

                    <List>
                        <ListItem sx={{ mb: 1 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <Phone color="info" />
                            </ListItemIcon>
                            <ListItemText
                                primary="+1 (555) 123-4567"
                                secondary="Lun-Vie 9:00-18:00"
                            />
                        </ListItem>
                    </List>
                </Stack>


                <Stack direction="row" spacing={7} flexWrap="wrap">
                    <Chip
                        icon={<CheckCircle />}
                        label="Todos los servicios operativos"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                    />
                    <Chip
                        icon={<AccessTime />}
                        label="Tiempo de respuesta promedio: 3 min"
                        color="warning"
                        variant="outlined"
                    />
                </Stack>

            </Paper>

            <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '300px' } }}>
                <Stack spacing={3}>
                    <Paper
                        elevation={4}
                        sx={{
                            p: 3,
                            mb: 3,
                            borderRadius: 3,
                            background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.info.light, 0.08)} 0%, ${alpha(theme.palette.info.light, 0.05)} 100%)`,
                            border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                        }}
                    >
                        <Box display="flex" alignItems="center" mb={2}>
                            <Help
                                sx={{
                                    mr: 2,
                                    color: (theme) => theme.palette.info.main,
                                    fontSize: '1.8rem',
                                }}
                            />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontFamily: "'Poppins', sans-serif",
                                    fontSize: { xs: "1.1rem", md: "1.3rem" },
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
                                    background: 'transparent',
                                    '&:before': { display: 'none' },
                                }}
                            >
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography variant="body2" fontWeight={500} sx={{
                                        fontFamily: "'Poppins', sans-serif"
                                    }}>
                                        {item.question}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2" color="text.secondary" sx={{
                                        fontFamily: "'Poppins', sans-serif"
                                    }}>
                                        {item.answer}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}

                    </Paper>
                </Stack>
            </Box>
        </Box >
    );
};