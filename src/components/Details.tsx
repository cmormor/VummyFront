import { Box, Typography } from "@mui/material";

interface Details {
  detail: string | number;
  fontSize?: number;
}

export const Details = ({ detail, fontSize }: Details) => {
  return (
    <Box
      sx={{
        width: "100%",
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
          variant="h6"
          sx={{
            textAlign: "center",
            mt: 2,
            color: (theme) => theme.palette.text.primary,
            width: "100%",
            lineHeight: "1.5",
            fontFamily: "'Poppins', sans-serif",
            fontSize: { fontSize },
          }}
        >
          {detail}
        </Typography>
      </Box>
    </Box>
  );
};
