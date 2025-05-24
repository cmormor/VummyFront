import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useNavigate } from "react-router-dom";
import { Details } from "../../../components/Details";
import { useRef, useState } from "react";
import { useThemeContext } from "../../../style/ThemeContext";
import {
  eliminarImagenClothe,
  subirImagenClothe,
} from "../../../api/clotheApi";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Loading } from "../../../components/Loading";

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
  const { mode } = useThemeContext();

  const [imagen, setImagen] = useState(imagenProp);
  const [loading, setLoading] = useState(false);

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
    <Box
      sx={{
        width: {
          xs: "100%",
          sm: "48%",
          md: "23%",
        },
        minWidth: "200px",
        position: "relative",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          borderColor: "#1976d2",
          borderWidth: "2px",
          backgroundColor: "transparent",
          boxShadow: "none",
          borderRadius: "8px",
          marginTop: 2,
          color: "white",
          width: "100%",
          marginBottom: 3,
          background: (theme) => theme.palette.background.paper,
          position: "relative",
          overflow: "hidden",
        }}
      >
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
              <AddPhotoAlternateIcon
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
                <DeleteOutlineIcon
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

        {loading ? (
          <Box
            sx={{
              width: "100%",
              height: 200,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              bgcolor: "background.default",
              color: "text.secondary",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            <Loading />
          </Box>
        ) : (
          imagen && (
            <Box
              component="img"
              src={`data:image/jpeg;base64,${imagen}`}
              alt={nombre}
              sx={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                cursor: "pointer",
              }}
              onClick={handleClick}
            />
          )
        )}

        <Box onClick={handleClick} sx={{ cursor: "pointer" }}>
          <CardContent sx={{ padding: 2 }}>
            <Details detail={nombre} fontSize={15} />
            <Details detail={precio} fontSize={15} />
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
};
