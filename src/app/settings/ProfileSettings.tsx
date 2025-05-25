import { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    Container,
    Alert,
    Paper,
    Typography,
    Divider,
    alpha,
    Fade,
    CircularProgress
} from "@mui/material";
import {
    Person,
    Email,
    Height,
    Straighten,
    EmojiPeople,
    Save,
    CheckCircle,
    Edit
} from "@mui/icons-material";
import { perfilUsuario, updateUsuario } from "../../api/userApi";
import { Usuario } from "../../types/user";

export const ProfileSettings = () => {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [altura, setAltura] = useState("");
    const [cuelloManga, setCuelloManga] = useState("");
    const [pecho, setPecho] = useState("");
    const [cintura, setCintura] = useState("");
    const [cadera, setCadera] = useState("");
    const [entrepierna, setEntrepierna] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // TODO: ADD SKELETON HERE AND IN SECURITY PAGE

    useEffect(() => {
        handleGetPerfil();
    }, []);

    const handleGetPerfil = async () => {
        try {

            const perfilActual = await perfilUsuario();
            setNombre(perfilActual.nombre || "");
            setEmail(perfilActual.email || "");
            setAltura(perfilActual.altura ? perfilActual.altura.toString() : "");
            setCuelloManga(perfilActual.cuelloManga ? perfilActual.cuelloManga.toString() : "");
            setPecho(perfilActual.pecho ? perfilActual.pecho.toString() : "");
            setCintura(perfilActual.cintura ? perfilActual.cintura.toString() : "");
            setCadera(perfilActual.cadera ? perfilActual.cadera.toString() : "");
            setEntrepierna(perfilActual.entrepierna ? perfilActual.entrepierna.toString() : "");

            setLoading(true);
            setError(null);
        } catch (error) {
            setError("Error al cargar el perfil. Por favor, inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const perfilActual = await perfilUsuario();

            const data: Partial<Usuario> = { ...perfilActual };

            if (nombre !== "") data.nombre = nombre;
            if (email !== "") data.email = email;

            if (altura !== "" && !isNaN(Number(altura))) data.altura = Number(altura);
            if (cuelloManga !== "" && !isNaN(Number(cuelloManga))) data.cuelloManga = Number(cuelloManga);
            if (pecho !== "" && !isNaN(Number(pecho))) data.pecho = Number(pecho);
            if (cintura !== "" && !isNaN(Number(cintura))) data.cintura = Number(cintura);
            if (cadera !== "" && !isNaN(Number(cadera))) data.cadera = Number(cadera);
            if (entrepierna !== "" && !isNaN(Number(entrepierna))) data.entrepierna = Number(entrepierna);

            const keysModificados = Object.keys(data).filter(
                (key) => data[key as keyof Usuario] !== perfilActual[key as keyof Usuario]
            );
            if (keysModificados.length === 0) {
                setError("No has introducido ningún dato para actualizar.");
                setLoading(false);
                return;
            }

            await updateUsuario(data);

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            setError("Error al guardar los cambios. Por favor, inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const textFieldStyles = {
        '& .MuiOutlinedInput-root': {
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "1rem", md: "1.1rem" },
            borderRadius: 2,
            backgroundColor: "background.paper",
            transition: 'all 0.3s ease',
            '& fieldset': {
                borderColor: "primary.main",
                borderWidth: 2,
            },
            '&:hover fieldset': {
                borderColor: "primary.main",
            },
            '&.Mui-focused fieldset': {
                borderColor: "primary.main",
            },
        },
        '& .MuiInputLabel-root': {
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "1rem", md: "1.1rem" },
            fontWeight: 500,
            color: "text.secondary",
            '&.Mui-focused': {
                color: "primary.main",
            },
        },
    };

    if (error) {
        return (
            <Container
                maxWidth="md"
                sx={{
                    minHeight: '50vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    px: { xs: 1, sm: 3 },
                }}
            >
                <Fade in={!!error}>
                    <Alert
                        severity="error"
                        sx={{
                            mb: 2,
                            borderRadius: 3,
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: { xs: "1rem", md: "1.1rem" },
                        }}
                    >
                        {error}
                    </Alert>
                </Fade>
            </Container>
        );
    }

    return (
        <Box sx={{ mt: 2, maxWidth: 800 }}>
            <Paper
                elevation={4}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.info.light, 0.08)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                    border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                }}
            >
                <Box display="flex" alignItems="center" mb={2}>
                    <Edit
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
                        Datos Personales
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

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 3,
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <TextField
                            label="Nombre completo"
                            fullWidth
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            sx={textFieldStyles}
                            InputProps={{
                                startAdornment: (
                                    <Person sx={{
                                        mr: 1,
                                        color: (theme) => alpha(theme.palette.text.secondary, 0.6),
                                        fontSize: '1.2rem'
                                    }} />
                                ),
                            }}
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <TextField
                            label="Correo electrónico"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={textFieldStyles}
                            InputProps={{
                                startAdornment: (
                                    <Email sx={{
                                        mr: 1,
                                        color: (theme) => alpha(theme.palette.text.secondary, 0.6),
                                        fontSize: '1.2rem'
                                    }} />
                                ),
                            }}
                        />
                    </Box>
                </Box>
            </Paper>

            <Paper
                elevation={4}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.info.light, 0.08)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                    border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                }}
            >
                <Box display="flex" alignItems="center" mb={2}>
                    <EmojiPeople
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
                        Medidas Corporales
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

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 3,
                        }}
                    >
                        <Box sx={{ flex: 1 }}>
                            <TextField
                                label="Altura (cm)"
                                type="number"
                                fullWidth
                                value={altura}
                                onChange={(e) => setAltura(e.target.value)}
                                sx={textFieldStyles}
                                InputProps={{
                                    startAdornment: (
                                        <Height sx={{
                                            mr: 1,
                                            color: (theme) => alpha(theme.palette.text.secondary, 0.6),
                                            fontSize: '1.2rem'
                                        }} />
                                    ),
                                }}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <TextField
                                label="Cuello/Manga (cm)"
                                type="number"
                                fullWidth
                                value={cuelloManga}
                                onChange={(e) => setCuelloManga(e.target.value)}
                                sx={textFieldStyles}
                                InputProps={{
                                    startAdornment: (
                                        <Straighten sx={{
                                            mr: 1,
                                            color: (theme) => alpha(theme.palette.text.secondary, 0.6),
                                            fontSize: '1.2rem'
                                        }} />
                                    ),
                                }}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <TextField
                                label="Pecho (cm)"
                                type="number"
                                fullWidth
                                value={pecho}
                                onChange={(e) => setPecho(e.target.value)}
                                sx={textFieldStyles}
                                InputProps={{
                                    startAdornment: (
                                        <Straighten sx={{
                                            mr: 1,
                                            color: (theme) => alpha(theme.palette.text.secondary, 0.6),
                                            fontSize: '1.2rem'
                                        }} />
                                    ),
                                }}
                            />
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 3,
                        }}
                    >
                        <Box sx={{ flex: 1 }}>
                            <TextField
                                label="Cintura (cm)"
                                type="number"
                                fullWidth
                                value={cintura}
                                onChange={(e) => setCintura(e.target.value)}
                                sx={textFieldStyles}
                                InputProps={{
                                    startAdornment: (
                                        <Straighten sx={{
                                            mr: 1,
                                            color: (theme) => alpha(theme.palette.text.secondary, 0.6),
                                            fontSize: '1.2rem'
                                        }} />
                                    ),
                                }}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <TextField
                                label="Cadera (cm)"
                                type="number"
                                fullWidth
                                value={cadera}
                                onChange={(e) => setCadera(e.target.value)}
                                sx={textFieldStyles}
                                InputProps={{
                                    startAdornment: (
                                        <Straighten sx={{
                                            mr: 1,
                                            color: (theme) => alpha(theme.palette.text.secondary, 0.6),
                                            fontSize: '1.2rem'
                                        }} />
                                    ),
                                }}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <TextField
                                label="Entrepierna (cm)"
                                type="number"
                                fullWidth
                                value={entrepierna}
                                onChange={(e) => setEntrepierna(e.target.value)}
                                sx={textFieldStyles}
                                InputProps={{
                                    startAdornment: (
                                        <Straighten sx={{
                                            mr: 1,
                                            color: (theme) => alpha(theme.palette.text.secondary, 0.6),
                                            fontSize: '1.2rem'
                                        }} />
                                    ),
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Paper>

            <Box display="flex" justifyContent="flex-start" gap={2}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleSave}
                    disabled={loading}
                    startIcon={
                        loading ?
                            <CircularProgress size={20} color="inherit" /> :
                            success ? <CheckCircle /> : <Save />
                    }
                    sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: { xs: "1rem", md: "1.1rem" },
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        textTransform: 'none',
                        letterSpacing: '0.5px',
                        background: success ?
                            (theme) => `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)` :
                            (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                        },
                        '&:active': {
                            transform: 'translateY(0)',
                        },
                        '&:disabled': {
                            background: (theme) => alpha(theme.palette.action.disabled, 0.12),
                            color: (theme) => theme.palette.action.disabled,
                        }
                    }}
                >
                    {loading ? 'Guardando...' : success ? '¡Guardado!' : 'Guardar Cambios'}
                </Button>
            </Box>

            <Fade in={success}>
                <Alert
                    severity="success"
                    sx={{
                        mt: 3,
                        borderRadius: 3,
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: { xs: "1rem", md: "1.1rem" },
                        background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.success.light, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                        border: (theme) => `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                    }}
                >
                    ¡Perfil actualizado correctamente!
                </Alert>
            </Fade>
        </Box>
    );
};