import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useNavigate } from "react-router-dom";
import { Details } from "../../../components/Details";

interface ClotheCardProps {
  nombre: string;
  precio: number;
  path: string;
}

export const ClotheCard = ({ nombre, precio, path }: ClotheCardProps) => {
  const navigate = useNavigate();

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
        }}
      >
        <CardContent sx={{ padding: 2 }}>
          <>
            <Details detail={nombre} fontSize={15} />
            <Details detail={precio} fontSize={15} />
          </>
        </CardContent>
      </Card>
    </Box>
  );
};
