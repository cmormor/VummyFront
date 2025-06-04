import { Box, Stack, Typography, IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import logoDiamante from "/VummyLogo_Azul_Diamante.png";

export const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        borderTop:
          theme.palette.mode === "dark"
            ? "1px solid rgba(255, 255, 255, 0.2)"
            : "1px solid rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(8px)",
        paddingY: 1,
        paddingX: 3,
      }}
    >
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <Box
          component="img"
          src={logoDiamante}
          alt="Logo"
          sx={{
            height: { xs: 28, sm: 40 },
          }}
        />

        <Typography
          variant="body2"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400,
            fontSize: "0.85rem",
          }}
        >
          © {currentYear} VummyApp - Todos los derechos reservados
        </Typography>

        <Stack direction="row" spacing={2}>
          <Tooltip title="GitHub">
            <IconButton
              href="https://github.com/cmormor"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              size="small"
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Contacto">
            <IconButton
              href="mailto:soporte.vummy@gmail.com"
              color="inherit"
              size="small"
            >
              <EmailIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="LinkedIn">
            <IconButton
              href="https://www.linkedin.com/in/carmen-morales"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              size="small"
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Box>
  );
};
