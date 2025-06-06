import { useState } from "react";
import * as yup from "yup";
import {
  Box,
  TextField,
  Button,
  Alert,
  Paper,
  Typography,
  Divider,
  alpha,
  Fade,
  CircularProgress,
  InputAdornment,
  IconButton,
  Snackbar,
} from "@mui/material";
import {
  Save,
  CheckCircle,
  Key,
  Lock,
  VisibilityOff,
  Visibility,
} from "@mui/icons-material";
import { perfilUsuario, updateUsuario } from "../../api/userApi";
import { Usuario } from "../../types/user";

const schema = yup.object().shape({
  password: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial"
    ),
});

export const SecuritySettings = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [snackbarError, setSnackbarError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleTogglePassword = () => {
    setMostrarPassword(!mostrarPassword);
  };

  const validatePasswordsMatch = (
    newPassword: string,
    newConfirmPassword: string
  ) => {
    if (newConfirmPassword && newPassword !== newConfirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      return false;
    } else {
      setConfirmPasswordError(null);
      return true;
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setFieldError(null);
    // Validar coincidencia si ya hay algo en confirmar contraseña
    if (confirmPassword) {
      validatePasswordsMatch(value, confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    // Validar coincidencia inmediatamente
    validatePasswordsMatch(password, value);
  };

  const handleSave = async () => {
    setLoading(true);
    setSnackbarError(null);
    setFieldError(null);
    setConfirmPasswordError(null);
    setSuccess(false);

    const formData = { password };
    try {
      await schema.validate(formData, { abortEarly: false });
    } catch (validationError) {
      if (validationError instanceof yup.ValidationError) {
        const mensajes = validationError.inner.map((e) => e.message);
        setFieldError(mensajes[0]);
      } else {
        setSnackbarError("Error en validación de datos.");
      }
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const perfilActual = await perfilUsuario();
      const dataToUpdate: Partial<Usuario> = { ...perfilActual };

      if (password !== "") {
        dataToUpdate.password = password;
      }

      const keysModificados = Object.keys(dataToUpdate).filter(
        (key) =>
          dataToUpdate[key as keyof Usuario] !==
          perfilActual[key as keyof Usuario]
      );

      if (keysModificados.length === 0) {
        setSnackbarError("No has introducido ningún dato para actualizar.");
        setLoading(false);
        return;
      }

      await updateUsuario(dataToUpdate);

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (apiError) {
      setSnackbarError(
        "Error al guardar los cambios. Por favor, inténtalo de nuevo."
      );
      console.error("Error en updateUsuario:", apiError);
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
    height: "56px",
    "& .MuiFormHelperText-root.Mui-error": {
      color: "error.main",
      fontWeight: "bold",
      backgroundColor: "transparent",
    },
    "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ff4444",
      borderWidth: 2,
    },
    "& .MuiInputLabel-root.Mui-error": {
      color: "#ff4444",
    },
  };

  return (
    <Box sx={{ mt: 2, maxWidth: 800 }}>
      <Snackbar
        open={Boolean(snackbarError)}
        autoHideDuration={6000}
        onClose={() => setSnackbarError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => setSnackbarError(null)}
          sx={{
            width: "100%",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {snackbarError}
        </Alert>
      </Snackbar>

      <Paper
        elevation={4}
        sx={{
          p: 4,
          pb: 10,
          mb: 3,
          borderRadius: 3,
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(
              theme.palette.error.light,
              0.08
            )} 0%, ${alpha(theme.palette.warning.light, 0.05)} 100%)`,
          border: (theme) =>
            `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <Key
            sx={{
              mr: 2,
              color: (theme) => theme.palette.error.main,
              fontSize: "1.8rem",
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              fontWeight: 600,
              color: (theme) => theme.palette.error.main,
            }}
          >
            Restablecer Contraseña
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
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <TextField
                label="Password"
                variant="outlined"
                type={mostrarPassword ? "text" : "password"}
                fullWidth
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                error={Boolean(fieldError)}
                helperText={fieldError || ""}
                sx={textFieldStyles}
                InputProps={{
                  startAdornment: (
                    <Lock
                      sx={{
                        mr: 1,
                        color: (theme) =>
                          alpha(theme.palette.text.secondary, 0.6),
                        fontSize: "1.2rem",
                      }}
                    />
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        sx={{ color: (theme) => theme.palette.text.primary }}
                      >
                        {mostrarPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <TextField
                label="Confirmar Password"
                variant="outlined"
                type={mostrarPassword ? "text" : "password"}
                fullWidth
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                error={Boolean(confirmPasswordError)}
                helperText={confirmPasswordError || ""}
                sx={textFieldStyles}
                InputProps={{
                  startAdornment: (
                    <Lock
                      sx={{
                        mr: 1,
                        color: (theme) =>
                          alpha(theme.palette.text.secondary, 0.6),
                        fontSize: "1.2rem",
                      }}
                    />
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        sx={{ color: (theme) => theme.palette.text.primary }}
                      >
                        {mostrarPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box display="flex" justifyContent="center" gap={2}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : success ? (
              <CheckCircle />
            ) : (
              <Save />
            )
          }
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "1rem", md: "1.1rem" },
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: 3,
            textTransform: "none",
            letterSpacing: "0.5px",
            background: success
              ? (theme) =>
                  `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
              : (theme) =>
                  `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-2px)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
            "&:disabled": {
              background: (theme) => alpha(theme.palette.action.disabled, 0.12),
              color: (theme) => theme.palette.action.disabled,
            },
          }}
        >
          {loading
            ? "Restableciendo..."
            : success
            ? "Contraseña Restablecida!"
            : "Restablecer Contraseña"}
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
            background: (theme) =>
              `linear-gradient(135deg, ${alpha(
                theme.palette.success.light,
                0.1
              )} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
            border: (theme) =>
              `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
          }}
        >
          Contraseña actualizada correctamente!
        </Alert>
      </Fade>
    </Box>
  );
};
