"use client";

import {
  Modal,
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  Fade,
  Backdrop,
} from "@mui/material";
import { AlertCircle } from "lucide-react";

interface ModalConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mensaje?: string;
  titulo?: string;
}

export const ModalConfirmation = ({
  open,
  onClose,
  onConfirm,
  mensaje,
  titulo,
}: ModalConfirmationProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(3px)",
          },
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: (theme) => theme.palette.background.paper,
            borderRadius: 3,
            p: 0,
            minWidth: { xs: 280, sm: 360 },
            maxWidth: "90vw",
            overflow: "hidden",
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: (theme) => `${theme.palette.error.main}15`,
                color: (theme) => theme.palette.error.main,
                borderRadius: "50%",
                p: 1,
                flexShrink: 0,
              }}
            >
              <AlertCircle size={24} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: (theme) => theme.palette.text.primary,
                }}
              >
                {titulo || "Confirmar acción"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  color: (theme) => theme.palette.text.secondary,
                  mt: 0.5,
                }}
              >
                {mensaje || "¿Estás seguro que deseas continuar?"}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                onClick={onClose}
                variant="outlined"
                size="medium"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  px: 3,
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.action.hover,
                  },
                  fontSize: "0.9rem",
                  fontFamily: "'Poppins', sans-serif",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={onConfirm}
                variant="contained"
                color="error"
                size="medium"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  px: 3,
                  boxShadow: (theme) =>
                    `0 4px 12px ${theme.palette.error.main}40`,
                  backgroundColor: (theme) => theme.palette.error.main,
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.error.dark,
                    boxShadow: (theme) =>
                      `0 6px 16px ${theme.palette.error.main}60`,
                  },
                  fontSize: "0.9rem",
                  fontFamily: "'Poppins', sans-serif",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                Confirmar
              </Button>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
