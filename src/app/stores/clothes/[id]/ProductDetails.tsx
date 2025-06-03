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
  alpha,
  IconButton,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StraightenIcon from "@mui/icons-material/Straighten";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RecommendIcon from "@mui/icons-material/Recommend";
import { useParams } from "react-router-dom";
import { getClotheById } from "../../../../api/clotheApi";
import { Clothe } from "../../../../types/clothe";
import { Size } from "../../../../types/size";
import { postItemToCart } from "../../../../api/cart-items";
import { getSizeClothe } from "../../../../api/size-clothe";
import ErrorModal from "../../../../components/ErrorModal";
import { sizesStore } from "../../../../api/storeApi";
import { perfilUsuario } from "../../../../api/userApi";
import { Usuario } from "../../../../types/user";

export default function ProductDetails() {
  const { clotheId } = useParams();
  const [dataRecommended, setDataRecommended] = useState<Size | null>(null);
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
  const [showRecommendation, setShowRecommendation] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataUser = await perfilUsuario();
        if (!dataUser) {
          setDataRecommended(null);
          return;
        }

        if (!storeSizes || storeSizes.length === 0) {
          setDataRecommended(null);
          return;
        }

        const distanciaMedidas = (size: Size, user: Usuario) => {
          let distancia = 0;
          if (size.altura != null && user.altura != null)
            distancia += Math.abs(size.altura - user.altura);
          if (size.cadera != null && user.cadera != null)
            distancia += Math.abs(size.cadera - user.cadera);
          if (size.cintura != null && user.cintura != null)
            distancia += Math.abs(size.cintura - user.cintura);
          if (size.cuelloManga != null && user.cuelloManga != null)
            distancia += Math.abs(size.cuelloManga - user.cuelloManga);
          if (size.pecho != null && user.pecho != null)
            distancia += Math.abs(size.pecho - user.pecho);
          if (size.entrepierna != null && user.entrepierna != null)
            distancia += Math.abs(size.entrepierna - user.entrepierna);
          return distancia;
        };

        let mejorTalla = null;
        let minDistancia = Infinity;

        for (const size of storeSizes) {
          const dist = distanciaMedidas(size, dataUser);
          if (dist < minDistancia) {
            minDistancia = dist;
            mejorTalla = size;
          }
        }

        setDataRecommended(mejorTalla);
      } catch (error) {
        console.error("Error al obtener tallas recomendadas:", error);
        setDataRecommended(null);
      }
    };

    fetchData();
  }, [storeSizes]);

  const handleRecommendSize = () => {
    setShowRecommendation(true);
    if (dataRecommended) {
      setSize(dataRecommended.nombre);
    }
  };

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
          <Box display="flex" gap={1} flexWrap="wrap">
            <Button
              size="small"
              startIcon={<RecommendIcon sx={{ fontSize: 16 }} />}
              onClick={handleRecommendSize}
              variant="outlined"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "0.85rem", md: "0.9rem" },
                textTransform: "none",
                color: (theme) => theme.palette.primary.main,
                borderColor: (theme) => theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              MI TALLA
            </Button>
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
                fontSize: { xs: "0.85rem", md: "0.9rem" },
                textTransform: "none",
              }}
            >
              GUÍA DE TALLAS
            </Button>
          </Box>
        </Box>

        {showRecommendation && (
          <Dialog
            open={showRecommendation}
            onClose={() => setShowRecommendation(false)}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              sx: {
                background: (theme) => theme.palette.background.paper,
                border: (theme) => `5px solid ${theme.palette.success.light}`,
                fontFamily: "'Poppins', sans-serif",
                textAlign: "center",
                position: "relative",
              },
            }}
          >
            <IconButton
              onClick={() => setShowRecommendation(false)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogTitle
              sx={{
                fontWeight: "bold",
                color: (theme) => theme.palette.text.primary,
                fontSize: { xs: "1rem", md: "1.1rem" },
                textDecorationLine: "underline",
                textUnderlineOffset: "4px",
                pr: 6, // Add padding to prevent overlap with close button
              }}
            >
              {dataRecommended
                ? `TALLA RECOMENDADA`
                : "No se pudo determinar una talla"}
            </DialogTitle>

            <DialogContent
              sx={{
                fontSize: { xs: "0.9rem", md: "1rem" },
                color: (theme) => theme.palette.text.primary,
              }}
            >
              {dataRecommended
                ? "Basado en tus medidas corporales, te recomendamos esta talla para un mejor ajuste."
                : "Completa tu perfil con tus medidas corporales para obtener recomendaciones personalizadas."}
              <br />
              <Typography
                sx={{
                  color: (theme) => theme.palette.success.main,
                  fontWeight: "bold",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 30,
                  display: "inline-block",
                  mt: 2,
                  pl: 1.5,
                  pr: 1.5,
                }}
              >
                {dataRecommended?.nombre}
              </Typography>
            </DialogContent>
          </Dialog>
        )}

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
              const isRecommended = dataRecommended?.nombre === option;
              return (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio disabled={!tallaDisponible} />}
                  label={
                    <Box display="flex" alignItems="center" gap={0.5}>
                      {option}
                      {isRecommended && (
                        <RecommendIcon
                          sx={{
                            fontSize: 16,
                            color: (theme) => theme.palette.success.main,
                          }}
                        />
                      )}
                    </Box>
                  }
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: "20px",
                      color: (theme) =>
                        tallaDisponible
                          ? isRecommended
                            ? theme.palette.success.main
                            : theme.palette.text.primary
                          : theme.palette.text.disabled,
                      fontWeight: isRecommended ? "bold" : "normal",
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
        PaperProps={{
          sx: {
            position: "relative",
          },
        }}
      >
        <IconButton
          onClick={() => setOpenDialog(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle
          sx={{
            textAlign: "center",
            fontFamily: "'Lexend Zetta', sans-serif",
            fontSize: { xs: "1.1rem", md: "1.5rem" },
            fontWeight: "bold",
            color: (theme) => theme.palette.primary.main,
            textDecorationLine: "underline",
            textUnderlineOffset: "10px",
            pr: 6,
          }}
        >
          GUÍA DE TALLAS
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              overflowX: "auto",
            }}
          >
            <Table
              sx={{
                minWidth: 650,
                background: (theme) =>
                  `linear-gradient(135deg, ${alpha(
                    theme.palette.info.light,
                    0.08
                  )} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                border: (theme) =>
                  `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                color: (theme) => theme.palette.text.primary,
              }}
            >
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
                  storeSizes
                    .slice()
                    .sort(
                      (a, b) =>
                        ["S", "M", "L", "XL"].indexOf(a.nombre) -
                        ["S", "M", "L", "XL"].indexOf(b.nombre)
                    )
                    .map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          backgroundColor:
                            dataRecommended?.id === row.id
                              ? (theme) =>
                                alpha(theme.palette.success.main, 0.1)
                              : "transparent",
                        }}
                      >
                        <TableCell align="center">
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            gap={0.5}
                          >
                            {row.nombre}
                            {dataRecommended?.id === row.id && (
                              <RecommendIcon
                                sx={{
                                  fontSize: 16,
                                  color: (theme) => theme.palette.success.main,
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>
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