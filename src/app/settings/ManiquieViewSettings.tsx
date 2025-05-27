import { alpha, Box, Divider, Paper, Typography, useTheme, useMediaQuery } from "@mui/material";
import ObjViewer from "../../components/ObjViewer";

export const ManiquieViewSettings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getViewerSize = () => {
    if (isSmallMobile) return 280;
    if (isMobile) return 400;
    return 700;
  };

  return (
    <Box sx={{
      mt: 2,
      maxWidth: 800,
      px: { xs: 1, sm: 2 },
      width: '100%'
    }}>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          borderRadius: 3,
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(
              theme.palette.info.light,
              0.08
            )} 0%, ${alpha(theme.palette.info.dark, 0.05)} 100%)`,
          border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              fontWeight: 600,
              color: (theme) => theme.palette.info.main,
            }}
          >
            MANIQUÍ
          </Typography>
        </Box>

        <Divider
          sx={{
            mb: 3,
            bgcolor: (theme) => alpha(theme.palette.info.main, 0.3),
            height: 2,
            borderRadius: 1,
          }}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <ObjViewer
            size={getViewerSize()}
            filename="/maniquieV2.obj"
          />
        </Box>
      </Paper>
    </Box>
  );
};