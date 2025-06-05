import { useState } from "react";
import { loginUsuario } from "../../../api/userApi";
import { Box, TextField, Button, Typography, Stack, InputAdornment, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Title } from "../../../components/Title";
import { FormCard } from "../../../components/FormCard";
import { Layout } from "../../../components/Layout";
import { Loading } from "../../../components/Loading";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleTogglePassword = () => {
    setMostrarPassword(!mostrarPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    const user = await loginUsuario(email, password);

    setIsLoading(false);

    if (user) {
      navigate("/home", { replace: true });
    } else {
      setError("Credenciales incorrectas");
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
        <FormCard path="/">
          <Title
            text="BIENVENIDO A VUMMY"
            sizeXs="1rem"
            sizeMd="2rem"
            marginTop={0}
            paddingTop="20px"
          />
          <form onSubmit={handleSubmit}>
            <Box m={2}>
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

            <Box m={2}>
              <TextField
                fullWidth
                label="Contraseña"
                variant="filled"
                type={mostrarPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end" sx={{ color: "black" }}>
                        {mostrarPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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

            <Box m={2}>
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
                    INICIAR SESIÓN
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
                    onClick={() => navigate("/reset-password")}
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
                    ¿Olvidaste tu contraseña?
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
