import { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Layout } from "../../../components/Layout";
import { FormCard } from "../../../components/FormCard";
import { Title } from "../../../components/Title";
import { Loading } from "../../../components/Loading";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../../api/userApi";

export const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await resetPassword(email, password);
            navigate("/login");
        } catch (err) {
            setError(
                (err as any)?.response?.data?.message || "Error al resetear la contraseña."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout color>
            <Stack
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    marginTop: 8,
                }}
            >
                <FormCard path="/login">
                    <Title
                        text="¿OLVIDASTE LA CONTRASEÑA?"
                        sizeXs="1rem"
                        sizeMd="2rem"
                        marginTop={0}
                        paddingTop="20px"
                    />
                    <Typography sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: { xs: "0.75rem", md: "1rem" },
                        textAlign: "center"
                    }}>
                        Ingresa tu correo y tu nueva contraseña. ¡Muchas gracias!

                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Box m={2} sx={{ maxWidth: 400, mx: "auto" }}>
                            <TextField
                                fullWidth
                                label="Email"
                                variant="filled"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Box>

                        <Box m={2} sx={{ maxWidth: 400, mx: "auto" }}>
                            <TextField
                                fullWidth
                                label="Contraseña"
                                variant="filled"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Box>


                        {error && (
                            <Typography
                                sx={{
                                    color: "red",
                                    textAlign: "center",
                                    margin: 2,
                                    fontWeight: "bold",
                                    fontFamily: "'Poppins', sans-serif",
                                }}
                            >
                                {error}
                            </Typography>
                        )}

                        <Box m={2} sx={{ maxWidth: 400, mx: "auto" }}>
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
                                            fontSize: { xs: "0.75rem", md: "1rem" },
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
                                            fontSize: { xs: "0.75rem", md: "1rem" },
                                            borderRadius: "8px",
                                        }}
                                    >
                                        ¿NO TIENES CUENTA? REGISTRATE
                                    </Button>
                                    <Button
                                        onClick={() => navigate("/login")}
                                        fullWidth
                                        color="primary"
                                        sx={{
                                            marginTop: 2,
                                            lineHeight: "1.5",
                                            fontFamily: "'Poppins', sans-serif",
                                            fontSize: { xs: "0.75rem", md: "1rem" },
                                            textDecorationLine: "underline",
                                            textUnderlineOffset: "4px",
                                        }}
                                    >
                                        ¿YA TIENES CUENTA? INICIA SESIÓN
                                    </Button>
                                </>
                            )}
                        </Box>
                    </form>
                </FormCard>
            </Stack>
        </Layout>
    );
};
