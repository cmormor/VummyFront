import { Modal, Box, Typography, Button, Stack } from "@mui/material";

interface ModalConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mensaje?: string;
}

export const ModalConfirmation = ({
  open,
  onClose,
  onConfirm,
  mensaje,
}: ModalConfirmationProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: (theme) => theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          minWidth: 300,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontFamily: "'Poppins', sans-serif",
            fontSize: "1.1rem",
          }}
        >
          {mensaje || "¿Estás seguro?"}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            onClick={onClose}
            variant="outlined"
            size="small"
            sx={{
              "&:hover": {
                backgroundColor: (theme) => theme.palette.action.hover,
              },
              fontSize: "0.9rem",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            color="error"
            size="small"
            sx={{
              backgroundColor: (theme) => theme.palette.error.main,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.error.dark,
              },
              fontSize: "0.9rem",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Confirmar
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};
