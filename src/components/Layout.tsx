import { ReactNode } from "react";
import { Box } from "@mui/joy";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1200, padding: 2 }}>{children}</Box>
    </Box>
  );
};
