import { useNavigate } from "react-router-dom";
import { Box, alpha } from "@mui/material";
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
    <Box
      onClick={handleClick}
      sx={{
        width: "100%",
        minHeight: "160px",
        borderRadius: "16px",
        border: `1px solid ${alpha("#1976d2", 0.3)}`,
        backdropFilter: "blur(10px)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        p: 3,
        m: 1.5,

        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          border: `1px solid ${alpha("#1976d2", 0.6)}`,
          background: `linear-gradient(135deg, 
            ${alpha("#1976d2", 0.25)} 0%, 
            ${alpha("#1976d2", 0.1)} 50%,
            ${alpha("#42a5f5", 0.15)} 100%)`,

          "&::before": {
            opacity: 1,
          },

          "& .store-content": {
            transform: "translateY(-2px)",
          },
        },

        "&:active": {
          transform: "translateY(-4px) scale(1.01)",
          transition: "all 0.15s ease",
        },

        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: "16px",
          padding: "1px",
          background: `linear-gradient(135deg,
            ${alpha("#1976d2", 0.6)},
            transparent,
            ${alpha("#42a5f5", 0.6)})`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "xor",
          opacity: 0,
          transition: "opacity 0.3s ease",
        },

        "&:hover::after": {
          opacity: 1,
        },
      }}
    >
      <Box
        className="store-content"
        sx={{
          transition: "transform 0.3s ease",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
