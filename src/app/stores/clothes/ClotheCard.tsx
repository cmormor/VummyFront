import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import {
  ImageNotSupported as NoImageIcon,
  AddPhotoAlternate,
  DeleteOutline,
} from "@mui/icons-material";
import {
  eliminarImagenClothe,
  subirImagenClothe,
} from "../../../api/clotheApi";
import { useThemeContext } from "../../../style/ThemeContext";

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
  rol,
}: ClotheCardProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imagen, setImagen] = useState(imagenProp);
  const [loading, setLoading] = useState(false);
  const { mode } = useThemeContext();

  const handleClick = () => {
    navigate(path);
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        await subirImagenClothe(id, file);

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagen(reader.result?.toString().split(",")[1] || "");
          setLoading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        setLoading(false);
        console.error("Error al subir la imagen", error);
      }
    }
  };

  const handleDeleteImage = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    try {
      setLoading(true);
      await eliminarImagenClothe(id);
      setImagen("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error al eliminar la imagen", error);
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
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered && !loading ? "translateY(-8px)" : "translateY(0)",
        border: (theme) =>
          `1px solid ${
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.08)"
          }`,
        "&:hover": {
          borderColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(25, 118, 210, 0.3)",
        },
      }}
      // ❌ NO onClick aquí - esta era la diferencia clave
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

      {rol === "ADMINISTRADOR" && (
        <>
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
              handleEditClick();
            }}
            sx={{
              position: "absolute",
              top: 8,
              right: imagen ? 40 : 8,
              backgroundColor: (theme) => theme.palette.background.paper,
              "&:hover": {
                backgroundColor:
                  mode === "dark"
                    ? "rgba(60, 60, 60, 0.9)"
                    : "rgba(200, 200, 200, 0.9)",
              },
              transition: "background 0.2s",
              pointerEvents: "auto",
              zIndex: 2,
            }}
          >
            <AddPhotoAlternate
              sx={{
                color: (theme) => theme.palette.text.primary,
                fontSize: 18,
              }}
            />
          </IconButton>

          {imagen && (
            <IconButton
              onClick={handleDeleteImage}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: (theme) => theme.palette.background.paper,
                "&:hover": {
                  backgroundColor:
                    mode === "dark"
                      ? "rgba(60, 60, 60, 0.9)"
                      : "rgba(200, 200, 200, 0.9)",
                },
                transition: "background 0.2s",
                pointerEvents: "auto",
                zIndex: 2,
              }}
            >
              <DeleteOutline
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  fontSize: 18,
                }}
              />
            </IconButton>
          )}
        </>
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
          cursor: "pointer", // ✅ Cursor pointer solo en la imagen
        }}
        onClick={handleClick} // ✅ onClick solo en la imagen
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
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.03)",
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
            background: (theme) =>
              imagen
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
          cursor: "pointer", // ✅ Cursor pointer solo en el contenido
        }}
        onClick={handleClick} // ✅ onClick solo en el contenido
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
