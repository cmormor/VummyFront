import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useNavigate } from "react-router-dom";
import { Details } from "../../../components/Details";
import camiNegra from "../../../../public/camiseta_negra.webp";
import camiBlanca from "../../../../public/camiseta_blanca.png";

interface ClotheCardProps {
  nombre: string;
  precio: number;
  path: string;
  imagen: string;
}

export const ClotheCard = ({ nombre, precio, path }: ClotheCardProps) => {
  const navigate = useNavigate();

  const randomImage = () => {
    const images = [camiNegra, camiBlanca];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  const handleClick = () => {
    navigate(path);
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
      }}
    >
      <Card
        onClick={handleClick}
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
          cursor: "pointer",
          background: (theme) => theme.palette.background.paper,
        }}
      >
        <img
          src={randomImage()}
          alt={nombre}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderTopLeftRadius: "6px",
            borderTopRightRadius: "6px",
          }}
        />
        <CardContent
          sx={{
            padding: 2,
          }}
        >
          <>
            <Details detail={nombre} fontSize={15} />
            <Details detail={precio} fontSize={15} />
          </>
        </CardContent>
      </Card>
    </Box>
  );
};
