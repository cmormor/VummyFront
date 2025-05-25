import { alpha, Box, Divider, Paper, Typography } from "@mui/material";
import logo from "/VummyLogo_Azul.png";

export const ManiquieViewSettings = () => {
    return (<Box sx={{ mt: 2, maxWidth: 800 }}>
        <Paper
            elevation={4}
            sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.info.light, 0.08)} 0%, ${alpha(theme.palette.info.dark, 0.05)} 100%)`,
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

            <Box>
                <Typography variant="body1" color="text.secondary" sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: { xs: "1.1rem", md: "1.3rem" },
                    mb: 15
                }}>
                    EN DESARROLLO
                </Typography>
            </Box>
            <Box>
                <img
                    src={logo}
                    alt="Logo"
                    style={{ width: 100, height: 100, }}
                />
            </Box>
        </Paper>
    </Box >);
};
