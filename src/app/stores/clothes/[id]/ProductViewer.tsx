import { useState, useEffect } from "react";
import { alpha, Box, Typography, useTheme, useMediaQuery, Chip, Skeleton, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import ObjViewer from "../../../../components/ObjViewer";
import { useParams } from "react-router-dom";
import { getClotheById } from "../../../../api/clotheApi";

export default function ProductViewer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { clotheId } = useParams();

  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showManiqui, setShowManiqui] = useState(false);

  useEffect(() => {
    if (clotheId) {
      setIsLoading(true);
      getClotheById(Number(clotheId))
        .then((res) => {
          if (res && res.imagen) {
            setImage(res.imagen);
          } else {
            setImage(null);
          }
        })
        .catch(() => {
          setImage(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [clotheId]);

  useEffect(() => {
    setShowManiqui(image ? false : true);
  }, [image]);

  const getViewerSize = () => {
    if (isSmallMobile) return 280;
    if (isMobile) return 400;
    return 400;
  };

  const toggleView = () => {
    setShowManiqui(!showManiqui);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        px: { xs: 1, sm: 2 },
        width: "100%",
        minHeight: { xs: 400, md: 450 },
        maxHeight: { xs: "auto", md: 600 },
        background: (theme) =>
          `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.primary.dark, 0.05)} 100%)`,
        borderRadius: 3,
        border: (theme) => `2px solid ${alpha(theme.palette.primary.main, 0.4)}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mx: "auto",
        p: 5,
        pb: 8,
        position: "relative",
      }}
    >
      {showManiqui && !isLoading && (
        <Box display="flex" alignItems="center" mb={2} gap={1}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              color: theme.palette.primary.main,
            }}
          >
            TÚ MANIQUÍ
          </Typography>
          <Chip
            label="DESARROLLO"
            size="small"
            variant="outlined"
            sx={{
              fontSize: { xs: "0.65rem", sm: "0.75rem" },
              color: "black",
              backgroundColor: theme.palette.warning.light,
              height: 24,
            }}
          />
        </Box>
      )}

      <IconButton
        onClick={toggleView}
        sx={{
          position: "absolute",
          left: showManiqui ? 20 : 'auto',
          right: showManiqui ? 'auto' : 20,
        }}
        aria-label="Cambiar vista"
      >
        {showManiqui ? <ArrowBackIos /> : <ArrowForwardIos />}
      </IconButton>

      {isLoading ? (
        <Skeleton
          variant="rectangular"
          width={getViewerSize()}
          height={getViewerSize()}
          animation="wave"
          sx={{ borderRadius: 2 }}
        />
      ) : showManiqui ? (
        <ObjViewer size={getViewerSize()} filename="/maniquieV2.obj" />
      ) : image ? (
        <Box
          component="img"
          src={`data:image/jpeg;base64,${image}`}
          alt="Foto de la prenda"
          sx={{
            width: getViewerSize(),
            height: getViewerSize(),
            borderRadius: 2,
            objectFit: "contain",
          }}
        />
      ) : (
        <Typography variant="body1" color="text.secondary">
          Imagen no disponible
        </Typography>
      )}
    </Box>
  );
}
