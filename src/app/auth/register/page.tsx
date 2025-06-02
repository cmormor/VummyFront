import { useState } from "react";
import * as yup from "yup";
import { createUsuario } from "../../../api/userApi";
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
  nombre: yup.string().min(3, "Mínimo 3 caracteres").required("El nombre es obligatorio"),
  email: yup.string().email("Email inválido").required("El email es obligatorio"),
  password: yup.string().min(8, "Mínimo 8 caracteres").required("La contraseña es obligatoria"),
  altura: yup
    .number()
    .typeError("La altura debe ser un número")
    .min(100, "La altura debe ser al menos 100 cm")
    .required("La altura es obligatoria"),
  cuelloManga: yup
    .number()
    .typeError("El cuello/manga debe ser un número")
    .min(25, "El cuello/manga debe ser al menos 25 cm")
    .required("El cuello/manga es obligatorio"),
  pecho: yup
    .number()
    .typeError("El pecho debe ser un número")
    .min(60, "El pecho debe ser al menos 60 cm")
    .required("El pecho es obligatorio"),
  cintura: yup
    .number()
    .typeError("La cintura debe ser un número")
    .min(50, "La cintura debe ser al menos 50 cm")
    .required("La cintura es obligatoria"),
  cadera: yup
    .number()
    .typeError("La cadera debe ser un número")
    .min(50, "La cadera debe ser al menos 50 cm")
    .required("La cadera es obligatoria"),
  entrepierna: yup
    .number()
    .typeError("La entrepierna debe ser un número")
    .min(50, "La entrepierna debe ser al menos 50 cm")
    .required("La entrepierna es obligatoria"),
});

export const Register = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [altura, setAltura] = useState<number | string>("");
  const [cuelloManga, setCuelloManga] = useState<number | string>("");
  const [pecho, setPecho] = useState<number | string>("");
  const [cintura, setCintura] = useState<number | string>("");
  const [cadera, setCadera] = useState<number | string>("");
  const [entrepierna, setEntrepierna] = useState<number | string>("");
  const [error, setError] = useState<string | null>(null);
  const [errorsForm, setErrorsForm] = useState<{ [key: string]: string }>({});
  const [isLoading, isSetLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      nombre,
      email,
      password,
      altura: Number(altura),
      cuelloManga: Number(cuelloManga),
      pecho: Number(pecho),
      cintura: Number(cintura),
      cadera: Number(cadera),
      entrepierna: Number(entrepierna),
    };

    try {
      setErrorsForm({});
      setError(null);

      await schema.validate(data, { abortEarly: false });

      isSetLoading(true);

      const result = await createUsuario(data);

      isSetLoading(false);

      if (typeof result === "string") {
        setError(result);
      } else {
        setNombre("");
        setEmail("");
        setPassword("");
        setAltura("");
        setCuelloManga("");
        setPecho("");
        setCintura("");
        setCadera("");
        setEntrepierna("");
        setError(null);
        navigate("/home", { replace: true });
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
    <>
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
              text="UNETE A VUMMY"
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
                Es necesario que ingrese sus medidas para poder brindarle una
                mejor experiencia en la app.
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={4.5}
              >
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  gap={2}
                  justifyContent="center"
                >
                  <TextField
                    fullWidth
                    label="Username"
                    variant="filled"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    error={!!errorsForm.nombre}
                    helperText={errorsForm.nombre}
                    sx={{
                      width: { xs: "100%", sm: "250px" },
                      height: "50px",
                      '& .MuiFormHelperText-root.Mui-error': {
                        color: 'error.main',
                        fontWeight: 'bold',
                      },
                      '& .MuiFilledInput-root.Mui-error': {
                        borderBottom: '2px solid #ff4444',
                      },
                      '& .MuiInputLabel-root.Mui-error': {
                        color: '#ff4444',
                      },
                    }}
                  />
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
                      width: { xs: "100%", sm: "250px" },
                      height: "50px",
                      '& .MuiFormHelperText-root.Mui-error': {
                        color: 'error.main',
                        fontWeight: 'bold',
                      },
                      '& .MuiFilledInput-root.Mui-error': {
                        borderBottom: '2px solid #ff4444',
                      },
                      '& .MuiInputLabel-root.Mui-error': {
                        color: '#ff4444',
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Contraseña"
                    variant="filled"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    error={!!errorsForm.password}
                    helperText={errorsForm.password}
                    sx={{
                      width: { xs: "100%", sm: "250px" },
                      height: "50px",
                      '& .MuiFormHelperText-root.Mui-error': {
                        color: 'error.main',
                        fontWeight: 'bold',
                      },
                      '& .MuiFilledInput-root.Mui-error': {
                        borderBottom: '2px solid #ff4444',
                      },
                      '& .MuiInputLabel-root.Mui-error': {
                        color: '#ff4444',
                      },
                    }}
                  />
                </Box>

                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  gap={2}
                  justifyContent="center"
                >
                  <TextField
                    fullWidth
                    label="Altura (cm)"
                    variant="filled"
                    type="number"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                    required
                    error={!!errorsForm.altura}
                    helperText={errorsForm.altura}
                    sx={{
                      width: { xs: "100%", sm: "250px" },
                      height: "50px",
                      '& .MuiFormHelperText-root.Mui-error': {
                        color: 'error.main',
                        fontWeight: 'bold',
                      },
                      '& .MuiFilledInput-root.Mui-error': {
                        borderBottom: '2px solid #ff4444',
                      },
                      '& .MuiInputLabel-root.Mui-error': {
                        color: '#ff4444',
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Cuello/Manga (cm)"
                    variant="filled"
                    type="number"
                    value={cuelloManga}
                    onChange={(e) => setCuelloManga(e.target.value)}
                    required
                    error={!!errorsForm.cuelloManga}
                    helperText={errorsForm.cuelloManga}
                    sx={{
                      width: { xs: "100%", sm: "250px" },
                      height: "50px",
                      '& .MuiFormHelperText-root.Mui-error': {
                        color: 'error.main',
                        fontWeight: 'bold',
                      },
                      '& .MuiFilledInput-root.Mui-error': {
                        borderBottom: '2px solid #ff4444',
                      },
                      '& .MuiInputLabel-root.Mui-error': {
                        color: '#ff4444',
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Pecho (cm)"
                    variant="filled"
                    type="number"
                    value={pecho}
                    onChange={(e) => setPecho(e.target.value)}
                    required
                    error={!!errorsForm.pecho}
                    helperText={errorsForm.pecho}
                    sx={{
                      width: { xs: "100%", sm: "250px" },
                      height: "50px",
                      '& .MuiFormHelperText-root.Mui-error': {
                        color: 'error.main',
                        fontWeight: 'bold',
                      },
                      '& .MuiFilledInput-root.Mui-error': {
                        borderBottom: '2px solid #ff4444',
                      },
                      '& .MuiInputLabel-root.Mui-error': {
                        color: '#ff4444',
                      },
                    }}
                  />
                </Box>

                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  gap={2}
                  justifyContent="center"
                >
                  <TextField
                    fullWidth
                    label="Cintura (cm)"
                    variant="filled"
                    type="number"
                    value={cintura}
                    onChange={(e) => setCintura(e.target.value)}
                    required
                    error={!!errorsForm.cintura}
                    helperText={errorsForm.cintura}
                    sx={{
                      width: { xs: "100%", sm: "250px" },
                      height: "50px",
                      '& .MuiFormHelperText-root.Mui-error': {
                        color: 'error.main',
                        fontWeight: 'bold',
                      },
                      '& .MuiFilledInput-root.Mui-error': {
                        borderBottom: '2px solid #ff4444',
                      },
                      '& .MuiInputLabel-root.Mui-error': {
                        color: '#ff4444',
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Cadera (cm)"
                    variant="filled"
                    type="number"
                    value={cadera}
                    onChange={(e) => setCadera(e.target.value)}
                    required
                    error={!!errorsForm.cadera}
                    helperText={errorsForm.cadera}
                    sx={{
                      width: { xs: "100%", sm: "250px" },
                      height: "50px",
                      '& .MuiFormHelperText-root.Mui-error': {
                        color: 'error.main',
                        fontWeight: 'bold',
                      },
                      '& .MuiFilledInput-root.Mui-error': {
                        borderBottom: '2px solid #ff4444',
                      },
                      '& .MuiInputLabel-root.Mui-error': {
                        color: '#ff4444',
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Entrepierna (cm)"
                    variant="filled"
                    type="number"
                    value={entrepierna}
                    onChange={(e) => setEntrepierna(e.target.value)}
                    required
                    error={!!errorsForm.entrepierna}
                    helperText={errorsForm.entrepierna}
                    sx={{
                      width: { xs: "100%", sm: "250px" },
                      height: "50px",
                      '& .MuiFormHelperText-root.Mui-error': {
                        color: 'error.main',
                        fontWeight: 'bold',
                      },
                      '& .MuiFilledInput-root.Mui-error': {
                        borderBottom: '2px solid #ff4444',
                      },
                      '& .MuiInputLabel-root.Mui-error': {
                        color: '#ff4444',
                      },
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

                {isLoading ? (
                  <Loading />
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: "#2196F3",
                      width: "100%",
                      fontSize: { xs: "0.50rem", md: "0.75rem" },
                      "&:hover": {
                        backgroundColor: "#1976D2",
                      },
                      borderRadius: "8px",
                    }}
                  >
                    REGISTRATE
                  </Button>
                )}
              </Box>
              <Button
                onClick={() => navigate("/login")}
                fullWidth
                variant="outlined"
                color="primary"
                sx={{
                  marginTop: 1,
                  lineHeight: "1.5",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: { xs: "0.50rem", md: "0.75rem" },
                  borderRadius: "8px",
                }}
              >
                ¿YA TIENES CUENTA? INICIA SESIÓN
              </Button>
            </form>
          </FormCard>
        </Stack>
      </Layout>
    </>
  );
};
