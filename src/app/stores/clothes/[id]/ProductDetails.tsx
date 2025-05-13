import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StraightenIcon from "@mui/icons-material/Straighten";
import { useParams } from "react-router-dom";
import { getClotheById } from "../../../../api/clotheApi";
import { Clothe } from "../../../../types/clothe";
import { Size } from "../../../../types/size";
import { sizesStore } from "../../../../api/storeApi";
import { Loading } from "../../../../components/Loading";

export default function ProductDetails() {
  const { clotheId } = useParams();
  const [clothe, setClothe] = useState<Clothe | null>(null);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [size, setSize] = useState("M");
  const [stock, setStock] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, isSetLoading] = useState(false);

  useEffect(() => {
    if (clotheId) {
      isSetLoading(true);
      getClotheById(Number(clotheId))
        .then((res) => {
          if (res) {
            setClothe(res);
            if (res.tiendaId) {
              sizesStore(res.tiendaId).then((sizesData) => {
                setSizes(sizesData || []);
              });
            }
            if (clothe?.stock !== undefined && clothe.stock > 0) {
              setStock(true);
            }
          }
        })
        .catch(() => {})
        .finally(() => {
          isSetLoading(false);
        });
    }
  }, [clothe?.stock, clotheId]);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return isLoading ? (
    <Box height="60vh">
      <Loading />
    </Box>
  ) : (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      px={{ xs: 2, md: 4 }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          fontFamily: "'Lexend Zetta', sans-serif",
          fontSize: { xs: "1.1rem", md: "2rem" },
          mb: 5,
          textTransform: "uppercase",
        }}
      >
        {clothe?.nombre}
      </Typography>

      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: { xs: "1rem", md: "1.75rem" },
          mb: 5,
        }}
      >
        {clothe?.precio} €
      </Typography>

      <Box mb={4}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "1rem", md: "1.5rem" },
          }}
        >
          Descripción
        </Typography>
        <Typography
          color="text.secondary"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "0.95rem", md: "1rem" },
          }}
        >
          {clothe?.descripcion || `No disponible.`}
        </Typography>
      </Box>

      <Box mb={4}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
          flexWrap="wrap"
          gap={1}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "1rem", md: "1.5rem" },
            }}
          >
            Talla
          </Typography>
          <Button
            size="small"
            startIcon={
              <StraightenIcon
                sx={{ fontSize: 16, transform: "rotate(45deg)" }}
              />
            }
            onClick={() => setOpenDialog(true)}
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "0.9rem", md: "1rem" },
              textTransform: "none",
            }}
          >
            GUÍA DE TALLAS
          </Button>
        </Box>

        <FormControl>
          <FormLabel
            sx={{
              mb: 2,
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "0.95rem", md: "1rem" },
            }}
          >
            Selecciona tu talla
          </FormLabel>
          <RadioGroup
            row
            value={size}
            onChange={(e) => setSize(e.target.value)}
            sx={{ flexWrap: "wrap", gap: 2 }}
          >
            {["S", "M", "L", "XL"].map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={option}
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "20px",
                  },
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>

      <Box mb={4}>
        {stock ? (
          <Box display="flex" alignItems="center" gap={1}>
            <CheckIcon sx={{ fontSize: 25, color: "green" }} />
            <Typography color="success" fontSize={15}>
              STOCK
            </Typography>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" gap={1}>
            <CloseIcon sx={{ fontSize: 25, color: "red" }} />
            <Typography color="error" fontSize={15}>
              STOCK
            </Typography>
          </Box>
        )}
      </Box>

      <Box mt="auto">
        <Button
          onClick={handleAddToCart}
          disabled={isAdding}
          fullWidth
          variant="contained"
          size="large"
          startIcon={
            isAdding ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <AddShoppingCartIcon sx={{ fontSize: 20 }} />
            )
          }
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "1rem", md: "1rem" },
          }}
        >
          {isAdding ? "Añadiendo..." : "Añadir al carrito"}
        </Button>
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontFamily: "'Lexend Zetta', sans-serif",
            fontSize: { xs: "1.1rem", md: "1.5rem" },
            fontWeight: "bold",
          }}
        >
          GUÍA DE TALLAS
        </DialogTitle>
        <DialogContent>
          <Box sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  {[
                    "Talla",
                    "Altura",
                    "CuelloManga",
                    "Pecho",
                    "Cintura",
                    "Cadera",
                    "Entrepierna",
                  ].map((col) => (
                    <TableCell
                      key={col}
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: { xs: "0.8rem", md: "1rem" },
                      }}
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sizes.length > 0 ? (
                  sizes.map((size) => (
                    <TableRow key={size.id || size.nombre}>
                      <TableCell align="center">{size.nombre}</TableCell>
                      <TableCell align="center">
                        {size.altura || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {size.cuelloManga || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {size.pecho || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {size.cintura || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {size.cadera || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {size.entrepierna || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No hay datos disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
