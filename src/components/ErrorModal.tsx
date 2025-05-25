import { Refresh, ErrorOutline, SupportAgent } from "@mui/icons-material"
import {
    Container,
    Typography,
    Button,
    Alert,
    Card,
    CardContent,
    Box,
    Fade,
    Divider,
    Stack,
    Tooltip,
    useTheme,
    alpha,
} from "@mui/material"
import { keyframes } from "@mui/system"

interface ErrorDisplayProps {
    error: string
}

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(244, 67, 54, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
  }
`

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`

export default function ErrorModal({ error }: ErrorDisplayProps) {
    const theme = useTheme()

    const handleRetry = () => {
        window.location.reload()
    }

    const handleSupport = () => {
        window.open('mailto:soporte@tuempresa.com', '_blank')
    }

    return (
        <Fade in={!!error} timeout={800}>
            <Container
                maxWidth="sm"
                sx={{
                    minHeight: "60vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 3,
                }}
            >
                <Card
                    sx={{
                        width: "100%",
                        maxWidth: 500,
                        background: `linear-gradient(135deg, 
                            ${alpha(theme.palette.background.paper, 0.95)} 0%, 
                            ${alpha(theme.palette.background.default, 0.98)} 100%)`,
                        backdropFilter: "blur(20px)",
                        borderRadius: 6,
                        border: `2px solid ${alpha(theme.palette.error.main, 0.1)}`,
                        boxShadow: `
                            0 20px 40px ${alpha(theme.palette.error.main, 0.1)},
                            0 0 0 1px ${alpha(theme.palette.error.main, 0.05)},
                            inset 0 1px 0 ${alpha(theme.palette.common.white, 0.1)}
                        `,
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: `
                                0 32px 64px ${alpha(theme.palette.error.main, 0.15)},
                                0 0 0 1px ${alpha(theme.palette.error.main, 0.1)}
                            `,
                        },
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "4px",
                            background: `linear-gradient(90deg, 
                                ${theme.palette.error.main} 0%, 
                                ${theme.palette.error.light} 50%, 
                                ${theme.palette.error.main} 100%)`,
                        },
                    }}
                >
                    <CardContent sx={{ p: 5, textAlign: "center", position: "relative" }}>
                        <Box
                            sx={{
                                position: "absolute",
                                top: -50,
                                right: -50,
                                width: 200,
                                height: 200,
                                borderRadius: "50%",
                                background: `radial-gradient(circle, 
                                    ${alpha(theme.palette.error.main, 0.05)} 0%, 
                                    transparent 70%)`,
                                animation: `${floatAnimation} 6s ease-in-out infinite`,
                            }}
                        />

                        <Box
                            sx={{
                                width: 100,
                                height: 100,
                                background: `linear-gradient(135deg, 
                                    ${theme.palette.error.main} 0%, 
                                    ${theme.palette.error.dark} 100%)`,
                                color: "white",
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                mx: "auto",
                                mb: 3,
                                position: "relative",
                                animation: `${pulseAnimation} 3s infinite`,
                                "&::after": {
                                    content: '""',
                                    position: "absolute",
                                    inset: -2,
                                    borderRadius: "50%",
                                    background: `conic-gradient(from 0deg, 
                                        ${theme.palette.error.main}, 
                                        ${theme.palette.error.light}, 
                                        ${theme.palette.error.main})`,
                                    mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
                                    zIndex: -1,
                                },
                            }}
                        >
                            <ErrorOutline sx={{ fontSize: 48 }} />
                        </Box>

                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                background: `linear-gradient(135deg, 
                                    ${theme.palette.text.primary} 0%, 
                                    ${theme.palette.text.secondary} 100%)`,
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                color: "transparent",
                                mb: 1,
                                fontFamily: "'Poppins', sans-serif",

                            }}
                        >
                            ¡Oops! Algo salió mal
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                                mb: 4, opacity: 0.8, fontFamily: "'Poppins', sans-serif",
                            }}
                        >
                            No te preocupes, estos errores suceden a veces
                        </Typography>

                        <Divider sx={{
                            my: 3,
                            background: `linear-gradient(90deg, 
                                transparent 0%, 
                                ${alpha(theme.palette.divider, 0.3)} 50%, 
                                transparent 100%)`,
                            height: "1px",
                            border: "none",
                        }} />

                        <Alert
                            severity="error"
                            icon={false}
                            sx={{
                                mb: 4,
                                borderRadius: 3,
                                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                                background: `linear-gradient(135deg, 
                                    ${alpha(theme.palette.error.main, 0.05)} 0%, 
                                    ${alpha(theme.palette.error.main, 0.02)} 100%)`,
                                backdropFilter: "blur(10px)",
                                "& .MuiAlert-message": {
                                    width: "100%",
                                    fontSize: "1rem",
                                    fontWeight: 500,
                                    lineHeight: 1.6,
                                },
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <ErrorOutline
                                    sx={{
                                        color: theme.palette.error.main,
                                        fontSize: 24,
                                        flexShrink: 0,
                                    }}
                                />
                                <Typography variant="body1" sx={{
                                    flex: 1, fontFamily: "'Poppins', sans-serif",
                                }}>
                                    {error}
                                </Typography>
                            </Box>
                        </Alert>

                        <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
                            <Button
                                variant="contained"
                                onClick={handleRetry}
                                startIcon={<Refresh />}
                                sx={{
                                    flex: 1,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    py: 1.5,
                                    px: 4,
                                    fontSize: "1rem",
                                    borderRadius: 3,
                                    background: `linear-gradient(135deg, 
                                        ${theme.palette.error.main} 0%, 
                                        ${theme.palette.error.dark} 100%)`,
                                    boxShadow: `0 8px 24px ${alpha(theme.palette.error.main, 0.3)}`,
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: `0 12px 32px ${alpha(theme.palette.error.main, 0.4)}`,
                                        background: `linear-gradient(135deg, 
                                            ${theme.palette.error.dark} 0%, 
                                            ${theme.palette.error.main} 100%)`,
                                    },
                                    "&:active": {
                                        transform: "translateY(0px)",
                                    },
                                    fontFamily: "'Poppins', sans-serif",
                                }}
                            >
                                Intentar de nuevo
                            </Button>

                            <Tooltip title="Contactar soporte técnico" arrow>
                                <Button
                                    variant="outlined"
                                    onClick={handleSupport}
                                    startIcon={<SupportAgent />}
                                    sx={{
                                        textTransform: "none",
                                        fontWeight: 600,
                                        py: 1.5,
                                        px: 3,
                                        borderRadius: 3,
                                        borderColor: alpha(theme.palette.error.main, 0.3),
                                        color: theme.palette.error.main,
                                        background: alpha(theme.palette.error.main, 0.02),
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            borderColor: theme.palette.error.main,
                                            background: alpha(theme.palette.error.main, 0.08),
                                            transform: "translateY(-1px)",
                                        },
                                        fontFamily: "'Poppins', sans-serif",
                                    }}
                                >
                                    Soporte
                                </Button>
                            </Tooltip>
                        </Stack>

                        <Box
                            sx={{
                                mt: 4,
                                p: 2,
                                borderRadius: 2,
                                background: alpha(theme.palette.background.default, 0.5),
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    fontFamily: "'Poppins', sans-serif",
                                    lineHeight: 1.6,
                                }}
                            >
                                Para utilizar bien el acceso al soporte se recomienda una aplicación de correo.
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Fade>
    )
}