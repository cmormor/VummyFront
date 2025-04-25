import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { ReactNode } from "react";

export const StoreCard = ({
  children,
  path,
}: {
  children: ReactNode;
  path: string;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  return (
    <Box sx={{ width: "100%" }}>
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
          marginBottom: 5,
          cursor: "pointer",
        }}
      >
        <CardContent sx={{ margin: 2 }}>{children}</CardContent>
      </Card>
    </Box>
  );
};
