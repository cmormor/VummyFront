import { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Paper,
    Typography,
    Divider,
    alpha,
    Skeleton,
    Button,
} from "@mui/material";
import {
    Person,
    Email,
    Height,
    Straighten,
    EmojiPeople,
    Edit,
} from "@mui/icons-material";
import { perfilUsuario, updateUsuario } from "../../api/userApi";
import { Usuario } from "../../types/user";
import ErrorModal from "../../components/ErrorModal";

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
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        handleGetPerfil();
    }, []);

    const handleGetPerfil = async () => {
        try {
            setLoading(true);
            const perfilActual = await perfilUsuario();
            setNombre(perfilActual.nombre || "");
            setEmail(perfilActual.email || "");
            setAltura(perfilActual.altura ? perfilActual.altura.toString() : "");
            setCuelloManga(perfilActual.cuelloManga ? perfilActual.cuelloManga.toString() : "");
            setPecho(perfilActual.pecho ? perfilActual.pecho.toString() : "");
            setCintura(perfilActual.cintura ? perfilActual.cintura.toString() : "");
            setCadera(perfilActual.cadera ? perfilActual.cadera.toString() : "");
            setEntrepierna(perfilActual.entrepierna ? perfilActual.entrepierna.toString() : "");
            setError(null);
        } catch (error) {
            setError("Error al cargar el perfil. Por favor, inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

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
        "& .MuiOutlinedInput-root": {
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "1rem", md: "1.1rem" },
            borderRadius: 2,
            backgroundColor: "background.paper",
            transition: "all 0.3s ease",
            "& fieldset": {
                borderColor: "primary.main",
                borderWidth: 2,
            },
            "&:hover fieldset": {
                borderColor: "primary.main",
            },
            "&.Mui-focused fieldset": {
                borderColor: "primary.main",
            },
        },
        "& .MuiInputLabel-root": {
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "1rem", md: "1.1rem" },
            fontWeight: 500,
            color: "text.secondary",
            "&.Mui-focused": {
                color: "primary.main",
            },
        },
    };

    if (error) {
        return <ErrorModal error={error} />;
    }

    const renderField = (
        label: string,
        value: string,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        icon: React.ReactNode,
        type = "text"
    ) => {
        if (loading) {
            return <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />;
        }
        return (
            <TextField
                label={label}
                fullWidth
                value={value}
                onChange={onChange}
                type={type}
                sx={textFieldStyles}
                InputProps={{
                    startAdornment: icon,
                }}
            />
        );
    };

    return (
        <Box sx={{ mt: 2, maxWidth: 800 }}>
            <Paper
                elevation={4}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    background: (theme) =>
                        `linear-gradient(135deg, ${alpha(theme.palette.info.light, 0.08)} 0%, ${alpha(
                            theme.palette.primary.light,
                            0.05
                        )} 100%)`,
                    border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                }}
            >
                <Box display="flex" alignItems="center" mb={2}>
                    <Edit
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

                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3 }}>
                    <Box sx={{ flex: 1 }}>
                        {renderField(
                            "Nombre completo",
                            nombre,
                            (e) => setNombre(e.target.value),
                            <Person
                                sx={{
                                    mr: 1,
                                    color: (theme) => alpha(theme.palette.text.secondary, 0.6),
                                    fontSize: "1.2rem",
                                }}
                            />
                        )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        {renderField(
                            "Correo electrónico",
                            email,
                            (e) => setEmail(e.target.value),
                            <Email
                                sx={{
                                    mr: 1,
                                    color: (theme) => alpha(theme.palette.text.secondary, 0.6),
                                    fontSize: "1.2rem",
                                }}
                            />,
                            "email"
                        )}
                    </Box>
                </Box>
            </Paper>

            <Paper
                elevation={4}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    background: (theme) =>
                        `linear-gradient(135deg, ${alpha(theme.palette.info.light, 0.08)} 0%, ${alpha(
                            theme.palette.primary.light,
                            0.05
                        )} 100%)`,
                    border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                }}
            >
                <Box display="flex" alignItems="center" mb={2}>
                    <EmojiPeople
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
                            fontSize: { xs: "1.1rem", md: "1.3rem" },
                            fontWeight: 600,
                            color: (theme) => theme.palette.info.main,
                        }}
                    >
                        Medidas corporales
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
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 3,
                    }}
                >
                    {renderField(
                        "Altura (cm)",
                        altura,
                        (e) => setAltura(e.target.value),
                        <Height
                            sx={{
                                mr: 1,
                                color: (theme) => alpha(theme.palette.text.secondary, 0.6),
                                fontSize: "1.2rem",
                            }}
                        />,
                        "number"
                    )}

                    {renderField(
                        "Cuello manga (cm)",
                        cuelloManga,
                        (e) => setCuelloManga(e.target.value),
                        <Straighten
                            sx={{
                                mr: 1,
                                color: (theme) => alpha(theme.palette.text.secondary, 0.6),
                                fontSize: "1.2rem",
                            }}
                        />,
                        "number"
                    )}

                    {renderField(
                        "Pecho (cm)",
                        pecho,
                        (e) => setPecho(e.target.value),
                        <Straighten
                            sx={{
                                mr: 1,
                                color: (theme) => alpha(theme.palette.text.secondary, 0.6),
                                fontSize: "1.2rem",
                            }}
                        />,
                        "number"
                    )}

                    {renderField(
                        "Cintura (cm)",
                        cintura,
                        (e) => setCintura(e.target.value),
                        <Straighten
                            sx={{
                                mr: 1,
                                color: (theme) => alpha(theme.palette.text.secondary, 0.6),
                                fontSize: "1.2rem",
                            }}
                        />,
                        "number"
                    )}

                    {renderField(
                        "Cadera (cm)",
                        cadera,
                        (e) => setCadera(e.target.value),
                        <Straighten
                            sx={{
                                mr: 1,
                                color: (theme) => alpha(theme.palette.text.secondary, 0.6),
                                fontSize: "1.2rem",
                            }}
                        />,
                        "number"
                    )}

                    {renderField(
                        "Entrepierna (cm)",
                        entrepierna,
                        (e) => setEntrepierna(e.target.value),
                        <Straighten
                            sx={{
                                mr: 1,
                                color: (theme) => alpha(theme.palette.text.secondary, 0.6),
                                fontSize: "1.2rem",
                            }}
                        />,
                        "number"
                    )}
                </Box>
            </Paper>

            <Box textAlign="center" mt={4}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleSave}
                    disabled={loading}
                    sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        fontSize: { xs: "1rem", md: "1.1rem" },
                        paddingX: 4,
                        borderRadius: 3,
                    }}
                >
                    Guardar cambios
                </Button>
                {success && (
                    <Typography
                        sx={{ mt: 2, color: "success.main", fontWeight: 600, fontSize: "1rem" }}
                    >
                        ¡Perfil actualizado correctamente!
                    </Typography>
                )}
            </Box>
        </Box>
    );
};
