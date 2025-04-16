import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export const FormCard = ({
  children,
  path,
}: {
  children: ReactNode;
  path: string;
}) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ minWidth: 275, maxWidth: 900, }}>
      <Card
        variant="outlined"
        sx={{
          borderColor: "#1976d2",
          backgroundColor: "transparent",
          boxShadow: "none",
          borderRadius: "8px",
        }}
      >
        <CardContent sx={{ margin: 2 }}>
          <IconButton
            onClick={() => navigate(path)}
            sx={{
              color: "gray",
              "&:hover": { color: "#fff" },
              padding: 0,
              minWidth: "auto",
              mr: 1,
            }}
          >
            <ArrowBackIosIcon sx={{ fontSize: { xs: 22, md: 28 } }} />
          </IconButton>
          {children}
        </CardContent>
      </Card>
    </Box>
  );
};
