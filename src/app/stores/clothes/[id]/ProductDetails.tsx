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
  Skeleton,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StraightenIcon from "@mui/icons-material/Straighten";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useParams } from "react-router-dom";
import { getClotheById } from "../../../../api/clotheApi";
import { Clothe } from "../../../../types/clothe";
import { Size } from "../../../../types/size";
import { postItemToCart } from "../../../../api/cart-items";
import { getSizeClothe } from "../../../../api/size-clothe";
import ErrorModal from "../../../../components/ErrorModal";
import { sizesStore } from "../../../../api/storeApi";

export default function ProductDetails() {
  const { clotheId } = useParams();
  const [clothe, setClothe] = useState<Clothe | null>(null);
  const [storeSizes, setStoreSizes] = useState<Size[]>([]);
  const [size, setSize] = useState("");
  const [sizeAvailable, setSizeAvailable] = useState<Clothe[]>([]);
  const [cantidad, setCantidad] = useState(1);
  const [stock, setStock] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingClothe, setLoadingClothe] = useState(false);
  const [loadingSizes, setLoadingSizes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clotheId) {
      setLoadingClothe(true);
      setError(null);
      getClotheById(Number(clotheId))
        .then((res) => {
          if (res) {
            setClothe(res);
            setStock(res.stock !== undefined && res.stock > 0);

            loadAvailableSizes(res.id!)
              .then((availableSizes) => {
                setSizeAvailable(availableSizes || []);
              })
              .finally(() => setLoadingSizes(false));
          }
        })
        .catch(() => {
          setClothe(null);
          setError("Error al cargar la prenda.");
        })
        .finally(() => {
          setLoadingClothe(false);
        });
    }
  }, [clotheId]);

  useEffect(() => {
    if (clothe?.tiendaId) {
      sizesStore(clothe.tiendaId)
        .then((sizes) => setStoreSizes(sizes))
        .catch(() => setStoreSizes([]));
    }
  }, [clothe]);

  const handleAddToCart = async () => {
    if (!clothe) return;

    const selectedSize = sizeAvailable.find((s) => s.tallaNombre === size);
    if (!selectedSize) return;

    const itemToPost = {
      prenda: {
        id: clothe.id!,
      },
      talla: {
        id: selectedSize.tallaId!,
      },
      cantidad: cantidad,
    };

    try {
      setIsAdding(true);
      await postItemToCart(itemToPost);
      setCantidad(1);
      window.location.reload();
    } catch (error) {
      setError(`Error al añadir al carrito: ${error}`);
    } finally {
      setIsAdding(false);
    }
  };

  const loadAvailableSizes = async (id: number) => {
    try {
      const availableSizes: Clothe[] = await getSizeClothe(id);
      return availableSizes;
    } catch (error) {
      setError(`Error cargando tallas disponibles ${error}`);
      return [];
    }
  };

  if (loadingClothe || loadingSizes) {
    return (
      <Box px={{ xs: 2, md: 4 }}>
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="80%" height={30} sx={{ mb: 5 }} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          sx={{ mb: 3 }}
        />
        <Skeleton variant="text" width="20%" height={30} sx={{ mb: 1 }} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={50}
          sx={{ mb: 5 }}
        />
        <Skeleton variant="rectangular" width="100%" height={50} />
      </Box>
    );
  }

  if (error) {
    return <ErrorModal error={error} />;
  }

  return (
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
          mb: 2,
          textTransform: "uppercase",
        }}
      >
        {clothe?.nombre}
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: { xs: "0.95rem", md: "1rem" },
          mb: 5,
        }}
      >
        {clothe?.descripcion || `No disponible.`}
      </Typography>

      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: { xs: "1rem", md: "1.75rem" },
          mb: 3,
        }}
      >
        {clothe?.precio} €
      </Typography>

      <Box mb={3}>
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
            {["S", "M", "L", "XL"].map((option) => {
              const tallaDisponible = sizeAvailable.find(
                (s) => s.tallaNombre === option
              );
              return (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio disabled={!tallaDisponible} />}
                  label={option}
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: "20px",
                      color: (theme) =>
                        tallaDisponible
                          ? theme.palette.text.primary
                          : theme.palette.text.disabled,
                    },
                  }}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
      </Box>

      <Box display="flex" alignItems="center" mb={5}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "1rem", md: "1.5rem" },
          }}
        >
          Cantidad
        </Typography>
        <Button
          onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
          sx={{ color: (theme) => theme.palette.text.primary }}
        >
          <RemoveIcon />
        </Button>
        <Typography variant="h6">{cantidad}</Typography>
        <Button
          onClick={() => setCantidad((prev) => prev + 1)}
          sx={{ color: (theme) => theme.palette.text.primary }}
        >
          <AddIcon />
        </Button>
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
          disabled={isAdding || !stock}
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
                {storeSizes.length > 0 ? (
                  storeSizes.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="center">{row.nombre}</TableCell>
                      <TableCell align="center">{row.altura}</TableCell>
                      <TableCell align="center">{row.cuelloManga}</TableCell>
                      <TableCell align="center">{row.pecho}</TableCell>
                      <TableCell align="center">{row.cintura}</TableCell>
                      <TableCell align="center">{row.cadera}</TableCell>
                      <TableCell align="center">{row.entrepierna}</TableCell>
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
