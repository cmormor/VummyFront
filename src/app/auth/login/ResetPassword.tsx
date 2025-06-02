import { useState } from "react";
import * as yup from "yup";
import { resetPassword } from "../../../api/userApi";
import {
    Box,
    TextField,
    Button,
    Typography,
    Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Title } from "../../../components/Title";
import { FormCard } from "../../../components/FormCard";
import { Layout } from "../../../components/Layout";
import { Loading } from "../../../components/Loading";

const schema = yup.object().shape({
    email: yup.string().email("Email inválido").required("El email es obligatorio"),
    password: yup.string().min(8, "Mínimo 8 caracteres").required("La contraseña es obligatoria"),
});

export const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [errorsForm, setErrorsForm] = useState<{ [key: string]: string }>({});
    const [isLoading, isSetLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            email,
            password,
        };

        try {
            setErrorsForm({});
            setError(null);

            await schema.validate(data, { abortEarly: false });

            isSetLoading(true);

            const result = await resetPassword(email, password);

            isSetLoading(false);

            if (typeof result === "string") {
                setError(result);
            } else {
                setEmail("");
                setPassword("");
                setError(null);
                navigate("/login", { replace: true });
            }
        } catch (validationError: any) {
            isSetLoading(false);
            if (validationError.inner) {
                const formErrors: { [key: string]: string } = {};
                validationError.inner.forEach((err: any) => {
                    if (err.path) formErrors[err.path] = err.message;
                });
                setErrorsForm(formErrors);
            } else {
                setError("Error inesperado en la validación");
            }
        }
    };

    return (
        <Layout color>
            <Stack
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    minHeight: "80vh",
                    padding: 2,
                }}
            >
                <FormCard path="/login">
                    <Title
                        text="¿OLVIDASTE LA CONTRASEÑA?"
                        sizeXs="1.25rem"
                        sizeMd="2rem"
                        marginTop={0}
                        paddingTop="0px"
                    />
                    <Box
                        sx={{
                            textAlign: "center",
                            maxWidth: "90%",
                            margin: "0 auto",
                            marginBottom: 2,
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{
                                fontSize: { xs: "0.9rem", sm: "1rem" },
                                color: "gray",
                            }}
                        >
                            Ingresa tu correo y tu nueva contraseña. ¡Muchas gracias!
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit} style={{ margin: "0 auto", textAlign: "center" }}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            gap={2}
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                width: "100%",
                                maxWidth: 450,
                                margin: "0 auto",
                                boxSizing: "border-box",
                                px: 2,
                            }}
                        >

                            <TextField
                                fullWidth
                                label="Email"
                                variant="filled"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                error={!!errorsForm.email}
                                helperText={errorsForm.email}
                                sx={{
                                    height: "56px",
                                    "& .MuiFormHelperText-root.Mui-error": {
                                        color: "error.main",
                                        fontWeight: "bold",
                                    },
                                    "& .MuiFilledInput-root.Mui-error": {
                                        borderBottom: "2px solid #ff4444",
                                    },
                                    "& .MuiInputLabel-root.Mui-error": {
                                        color: "#ff4444",
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Nueva Contraseña"
                                variant="filled"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                error={!!errorsForm.password}
                                helperText={errorsForm.password}
                                sx={{
                                    height: "56px",
                                    "& .MuiFormHelperText-root.Mui-error": {
                                        color: "error.main",
                                        fontWeight: "bold",
                                    },
                                    "& .MuiFilledInput-root.Mui-error": {
                                        borderBottom: "2px solid #ff4444",
                                    },
                                    "& .MuiInputLabel-root.Mui-error": {
                                        color: "#ff4444",
                                    },
                                }}
                            />

                            {error && (
                                <Typography
                                    sx={{
                                        color: "red",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        fontFamily: "'Poppins', sans-serif",
                                    }}
                                >
                                    {error}
                                </Typography>
                            )}

                            <Box sx={{ width: "100%", maxWidth: 450 }}>
                                {isLoading ? (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginTop: 2,
                                        }}
                                    >
                                        <Loading />
                                    </Box>
                                ) : (
                                    <>
                                        <Button
                                            fullWidth
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                marginTop: 2,
                                                lineHeight: "1.5",
                                                fontFamily: "'Poppins', sans-serif",
                                                fontSize: { xs: "0.9rem", md: "1.1rem" },
                                                borderRadius: "8px",
                                            }}
                                        >
                                            RESETEAR CONTRASEÑA
                                        </Button>
                                        <Button
                                            onClick={() => navigate("/register")}
                                            fullWidth
                                            variant="outlined"
                                            color="primary"
                                            sx={{
                                                marginTop: 2,
                                                lineHeight: "1.5",
                                                fontFamily: "'Poppins', sans-serif",
                                                fontSize: { xs: "0.9rem", md: "1.1rem" },
                                                borderRadius: "8px",
                                            }}
                                        >
                                            ¿NO TIENES CUENTA? REGÍSTRATE
                                        </Button>
                                        <Button
                                            onClick={() => navigate("/login")}
                                            fullWidth
                                            color="primary"
                                            sx={{
                                                marginTop: 2,
                                                lineHeight: "1.5",
                                                fontFamily: "'Poppins', sans-serif",
                                                fontSize: { xs: "0.9rem", md: "1.1rem" },
                                                textDecorationLine: "underline",
                                                textUnderlineOffset: "4px",
                                            }}
                                        >
                                            ¿YA TIENES CUENTA? INICIA SESIÓN
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </form>
                </FormCard>
            </Stack>
        </Layout>
    );
};
