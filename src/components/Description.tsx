import { Box, Typography } from "@mui/joy";

interface Title {
  text: string;
  sizeXs?: string;
  sizeMd?: string;
}

export const Description = ({ text, sizeXs, sizeMd }: Title) => {
  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: sizeXs, md: sizeMd },
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
          level="body-lg"
          sx={{
            textAlign: "center",
            mt: 3,
            color: "lightgrey",
            width: "100%",
            lineHeight: "1.5",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
};
