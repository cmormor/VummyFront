import { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Loading } from "../../../../components/Loading";

export default function ProductViewer() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        height: { xs: 500, md: 600 },
        backgroundColor: (theme) => theme.palette.background.paper,
        borderRadius: 2,
        border: (theme) => `2px solid ${theme.palette.text.primary}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      {isLoading ? (
        <Box textAlign="center">
          <Loading />
          <Typography
            variant="body1"
            mt={2}
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "0.75rem", md: "1.5rem" },
            }}
          >
            Cargando modelo 3D...
          </Typography>
        </Box>
      ) : (
        <Paper
          variant="outlined"
          sx={{
            borderStyle: "dashed",
            width: "100%",
            maxWidth: 400,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            mb={2}
            sx={{ fontFamily: "'Lexend Zetta', sans-serif" }}
          >
            Modelo 3D Blender
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            El maniquí 3D estará disponible próximamente
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Aquí se integrará un modelo de Blender cuando esté listo
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
