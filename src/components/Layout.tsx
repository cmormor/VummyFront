import { ReactNode } from "react";
import { Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface LayoutProps {
  children: ReactNode;
  color?: boolean;
  arrow?: boolean;
}

export const Layout = ({ children, color, arrow }: LayoutProps) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        minHeight: "100vh",
        "@media (max-width: 768px)": {
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          flex: 1,
          backgroundColor: (theme) =>
            color
              ? theme.palette.background.default
              : theme.palette.background.paper,
          "@media (max-width: 768px)": {
            display: "none",
          },
        }}
      />

      <Box
        sx={{
          flex: 5,
          padding: 2,
          marginTop: 10,
          backgroundColor: (theme) => theme.palette.background.default,
          zIndex: 1,
          "@media (max-width: 768px)": {
            flex: 1,
            marginTop: 5,
          },
        }}
      >
        {arrow && (
          <IconButton
            onClick={() => navigate("/home")}
            sx={{
              color: "gray",
              "&:hover": { color: (theme) => theme.palette.text.primary },
              padding: 0,
              minWidth: "auto",
            }}
          >
            <ArrowBackIcon sx={{ fontSize: { xs: 22, md: 28 } }} />
          </IconButton>
        )}
        {children}
      </Box>

      <Box
        sx={{
          flex: 1,
          backgroundColor: (theme) =>
            color
              ? theme.palette.background.default
              : theme.palette.background.paper,
          "@media (max-width: 768px)": {
            display: "none",
          },
        }}
      />
    </Box>
  );
};
