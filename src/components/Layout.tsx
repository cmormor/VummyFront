import { ReactNode } from "react";
import { Box } from "@mui/material";

interface LayoutProps {
  children: ReactNode;
  color?: boolean;
}

export const Layout = ({ children, color }: LayoutProps) => {
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
