import { Box, Typography } from "@mui/material";

interface Title {
  text: string;
  sizeXs?: string;
  sizeMd?: string;
}

export const Title = ({ text, sizeXs, sizeMd }: Title) => {
  return (
    <Box
      sx={{
        marginTop: 5,
        paddingTop: "90px",
        marginBottom: 3,
        width: "100%",
        px: { xs: 2, md: 4 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          maxWidth: "100%",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Lexend Zetta', sans-serif",
            fontWeight: 200,
            fontSize: { xs: sizeXs || "1.2rem", md: sizeMd || "2.2rem" },
            whiteSpace: "normal",
            wordBreak: "break-word",
            maxWidth: "80vw",
          }}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
};
