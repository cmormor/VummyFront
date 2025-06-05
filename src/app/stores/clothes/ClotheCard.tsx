import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  Tooltip,
  Fade,
  CircularProgress,
  Backdrop,
  useTheme,
} from "@mui/material";
import {
  ImageNotSupported as NoImageIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  eliminarImagenClothe,
  subirImagenClothe,
} from "../../../api/clotheApi";

interface ClotheCardProps {
  id: number;
  nombre: string;
  precio: number;
  path: string;
  imagen: string;
  rol: string;
}

export const ClotheCard = ({
  nombre,
  precio,
  path,
  id,
  imagen: imagenProp,
  rol
}: ClotheCardProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagen, setImagen] = useState(imagenProp);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();

  const isAdmin = rol === "ADMINISTRADOR";

  const handleClick = () => {
    if (!loading) {
      navigate(path);
    }
  };

  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      await subirImagenClothe(id, file);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(",")[1] || "";
        setImagen(base64String);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setLoading(false);
      console.error("Error al subir la imagen:", error);
    }
  };

  const handleDeleteImage = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      setLoading(true);
      await eliminarImagenClothe(id);
      setImagen("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error al eliminar la imagen:", error);
    }
  };

  return (
    <Card
      variant="outlined"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        width: { xs: "280px", sm: "300px", md: "320px" },
        height: "420px",
        borderRadius: 3,
        overflow: "hidden",
        cursor: loading ? "default" : "pointer",
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered && !loading ? "translateY(-8px)" : "translateY(0)",
        border: (theme) =>
          `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}`,
        "&:hover": {
          borderColor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(25, 118, 210, 0.3)",
        }
      }}
      onClick={handleClick}
    >
      <Backdrop
        sx={{
          position: "absolute",
          zIndex: 10,
          borderRadius: 3,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
        open={loading}
      >
        <CircularProgress color="primary" size={40} />
      </Backdrop>

      {isAdmin && (
        <Fade in={isHovered || imagen !== ""} timeout={200}>
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 5,
              zIndex: 5,
              display: "flex",
              gap: 1,
            }}
          >
            <Tooltip title="Cambiar imagen" arrow>
              <IconButton
                onClick={handleEditClick}
                size="small"
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  backdropFilter: "blur(10px)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {imagen && (
              <Tooltip title="Eliminar imagen" arrow>
                <IconButton
                  onClick={handleDeleteImage}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(244, 67, 54, 0.8)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                    "&:hover": {
                      backgroundColor: "rgba(244, 67, 54, 0.9)",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Fade>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <Box
        sx={{
          height: "280px",
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {imagen ? (
          <Box
            component="img"
            src={`data:image/jpeg;base64,${imagen}`}
            alt={nombre}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transition: "transform 0.3s ease",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
              padding: "8px",
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
              color: "text.secondary",
              transition: "all 0.3s ease",
            }}
          >
            <NoImageIcon
              sx={{
                fontSize: 64,
                mb: 2,
                opacity: 0.4,
                transition: "all 0.3s ease",
                transform: isHovered ? "scale(1.1)" : "scale(1)",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                opacity: 0.6,
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              Sin Imagen
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50px",
            zIndex: -1,
            background: imagen
              ? `linear-gradient(
                180deg,
                transparent,
                ${theme.palette.background.default}
              )`
              : "none",
            pointerEvents: "none",
          }}
        />
      </Box>

      <CardContent
        sx={{
          height: "140px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            mt: "auto",
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              fontSize: "1.1rem",
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textAlign: "center",
              fontFamily: "'Poppins', sans-serif",
              mb: 1,
            }}
          >
            {nombre}
          </Typography>

          <Typography
            variant="h5"
            component="span"
            sx={{
              fontWeight: 700,
              fontSize: "1.3rem",
              textAlign: "center",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {precio.toFixed(2)} €
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};