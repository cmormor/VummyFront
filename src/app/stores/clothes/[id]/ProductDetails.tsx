import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
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
  Paper,
  useTheme,
  Chip,
  Fade,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
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
import { HelpingHandIcon, InfoIcon, RulerIcon, ShirtIcon } from "lucide-react";

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
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (clotheId) {
      setLoadingClothe(true);
      setLoadingAvailability(true);
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
              .finally(() => {
                setLoadingAvailability(false);
              });
          }
        })
        .catch(() => {
          setClothe(null);
          setError("Error al cargar la prenda.");
          setLoadingAvailability(false);
        })
        .finally(() => {
          setLoadingClothe(false);
        });
    }
  }, [clotheId]);

  useEffect(() => {
    if (dataRecommended && sizeAvailable.length > 0 && !size) {
      const tallaRecomendadaDisponible = sizeAvailable.find(
        (s) => s.tallaNombre === dataRecommended.nombre
      );

      if (tallaRecomendadaDisponible) {
        setSize(dataRecommended.nombre);
      }
    }
  }, [dataRecommended, sizeAvailable, size]);

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

  const handleAddToCart = async () => {
    if (!clothe) return;

    const selectedSize = sizeAvailable.find((s) => s.tallaNombre === size);
    if (!selectedSize) return;

    const itemToPost = {
      prenda: clothe.id!,
      talla: selectedSize.tallaId!,
      cantidad: cantidad,
    };

    try {
      setIsAdding(true);
      await postItemToCart(itemToPost);
      setCantidad(1);
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

  if (loadingClothe) {
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
          mb={4}
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
            TALLA
          </Typography>

          <Box display="flex" gap={1} flexWrap="wrap">
            <Button
              variant="outlined"
              onClick={() => setShowRecommendation(true)}
              startIcon={<ShirtIcon />}
              sx={{
                color: theme.palette.success.main,
                borderColor: theme.palette.success.main,
                borderRadius: 3,
                fontSize: "0.9rem",
              }}
            >
              Mi Talla
            </Button>

            <Button
              variant="outlined"
              size="small"
              startIcon={<RulerIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                borderRadius: 3,
                fontSize: "0.9rem",
              }}
            >
              Guía de Tallas
            </Button>
          </Box>
        </Box>

        {loadingAvailability ? (
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            mb={3}
            sx={{
              padding: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <CircularProgress size={20} />
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Cargando disponibilidad de tallas...
            </Typography>
          </Box>
        ) : (
          <FormControl>
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
        )}

        {showRecommendation && (
          <Dialog
            open={showRecommendation}
            onClose={() => setShowRecommendation(false)}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              sx: {
                background: theme.palette.background.paper,
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: `0 24px 80px ${alpha(
                  theme.palette.common.black,
                  0.2
                )}`,
                position: "relative",
              },
            }}
            BackdropProps={{
              sx: {
                backgroundColor: alpha(theme.palette.common.black, 0.7),
                backdropFilter: "blur(8px)",
              },
            }}
          >
            <Box
              sx={{
                height: 8,
                width: "100%",
                background: dataRecommended
                  ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
                  : `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
              }}
            />

            <IconButton
              onClick={() => setShowRecommendation(false)}
              sx={{
                position: "absolute",
                right: 16,
                top: 16,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: "blur(8px)",
              }}
            >
              <CloseIcon sx={{ color: theme.palette.text.secondary }} />
            </IconButton>

            <Box sx={{ px: 4, pt: 5, pb: 4, textAlign: "center" }}>
              <Fade in={true}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: alpha(
                      dataRecommended
                        ? theme.palette.success.main
                        : theme.palette.warning.main,
                      0.1
                    ),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  {dataRecommended ? (
                    <CheckIcon
                      sx={{
                        fontSize: 40,
                        color: theme.palette.success.main,
                      }}
                    />
                  ) : (
                    <HelpingHandIcon />
                  )}
                </Box>
              </Fade>

              <DialogTitle
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                  p: 0,
                  mb: 1,
                  fontFamily: "'Poppins', sans-serif",
                  position: "relative",
                  display: "inline-block",
                }}
              >
                {dataRecommended
                  ? "TALLA RECOMENDADA"
                  : "No se pudo determinar una talla"}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -4,
                    left: "10%",
                    width: "80%",
                    height: 3,
                    background: dataRecommended
                      ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
                      : `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
                    borderRadius: 2,
                  }}
                />
              </DialogTitle>

              <DialogContent sx={{ p: 0, mt: 3 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "0.95rem", md: "1.05rem" },
                    color: theme.palette.text.secondary,
                    fontFamily: "'Poppins', sans-serif",
                    mb: 4,
                    maxWidth: 400,
                    mx: "auto",
                  }}
                >
                  {dataRecommended
                    ? "Basado en tus medidas corporales, te recomendamos esta talla para un mejor ajuste y comodidad."
                    : "Completa tu perfil con tus medidas corporales para obtener recomendaciones personalizadas."}
                </Typography>

                {dataRecommended && (
                  <Fade in={true}>
                    <Paper
                      elevation={0}
                      sx={{
                        display: "inline-block",
                        borderRadius: 3,
                        py: 1.5,
                        px: 4,
                        background: `linear-gradient(135deg, ${alpha(
                          theme.palette.success.main,
                          0.12
                        )} 0%, ${alpha(
                          theme.palette.success.light,
                          0.08
                        )} 100%)`,
                        border: `2px solid ${alpha(
                          theme.palette.success.main,
                          0.3
                        )}`,
                        mb: 3,
                      }}
                    >
                      <Typography
                        variant="h2"
                        sx={{
                          color: theme.palette.success.main,
                          fontWeight: "bold",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: { xs: "3rem", md: "4rem" },
                          letterSpacing: "0.05em",
                          textShadow: `0 2px 10px ${alpha(
                            theme.palette.success.main,
                            0.3
                          )}`,
                        }}
                      >
                        {dataRecommended?.nombre}
                      </Typography>
                    </Paper>
                  </Fade>
                )}
              </DialogContent>
            </Box>
          </Dialog>
        )}
      </Box>

      <Box display="flex" alignItems="center" mb={5} mt={2}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "1rem", md: "1.5rem" },
            pr: 2,
          }}
        >
          CANTIDAD
        </Typography>
        <Button
          onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
          sx={{ color: (theme) => theme.palette.text.primary }}
        >
          <RemoveIcon />
        </Button>
        <Typography variant="h6" sx={{ px: 2 }}>
          {cantidad}
        </Typography>
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
        maxWidth="lg"
        PaperProps={{
          sx: {
            position: "relative",
            borderRadius: 4,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.background.paper,
              0.95
            )} 0%, ${alpha(theme.palette.background.default, 0.98)} 100%)`,
            backdropFilter: "blur(20px)",
            boxShadow: `0 24px 80px ${alpha(theme.palette.common.black, 0.15)}`,
            overflow: "hidden",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: alpha(theme.palette.common.black, 0.7),
            backdropFilter: "blur(8px)",
          },
        }}
      >
        <IconButton
          onClick={() => setOpenDialog(false)}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            zIndex: 10,
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: "blur(10px)",
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
            "&:hover": {
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              transform: "scale(1.1)",
              boxShadow: `0 6px 25px ${alpha(
                theme.palette.common.black,
                0.15
              )}`,
            },
          }}
        >
          <CloseIcon sx={{ color: theme.palette.text.secondary }} />
        </IconButton>

        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.08
            )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            px: 4,
            py: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontFamily: "'Lexend Zetta', sans-serif",
              fontWeight: "bold",
              color: theme.palette.primary.main,
              mb: 1,
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            GUÍA DE TALLAS
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.primary,
              maxWidth: "100%",
              mx: "auto",
            }}
          >
            Encuentra tu talla perfecta con nuestra guía detallada de medidas
          </Typography>
        </Box>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: "blur(10px)",
              }}
            >
              <Box sx={{ overflowX: "auto" }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        background: `linear-gradient(135deg, ${alpha(
                          theme.palette.primary.main,
                          0.05
                        )} 0%, ${alpha(
                          theme.palette.primary.main,
                          0.03
                        )} 100%)`,
                      }}
                    >
                      {[
                        "Talla",
                        "Altura (cm)",
                        "Cuello/Manga",
                        "Pecho (cm)",
                        "Cintura (cm)",
                        "Cadera (cm)",
                        "Entrepierna (cm)",
                      ].map((col) => (
                        <TableCell
                          key={col}
                          align="center"
                          sx={{
                            fontWeight: "bold",
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: { xs: "0.85rem", md: "0.95rem" },
                            color: theme.palette.text.primary,
                            py: 2.5,
                            borderBottom: `2px solid ${alpha(
                              theme.palette.primary.main,
                              0.1
                            )}`,
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
                        .map((row, index) => (
                          <TableRow
                            key={row.id}
                            sx={{
                              backgroundColor:
                                dataRecommended?.id === row.id
                                  ? alpha(theme.palette.primary.main, 0.08)
                                  : index % 2 === 0
                                    ? alpha(theme.palette.background.default, 0.3)
                                    : "transparent",
                              borderLeft:
                                dataRecommended?.id === row.id
                                  ? `4px solid ${theme.palette.primary.main}`
                                  : "4px solid transparent",
                            }}
                          >
                            <TableCell align="center" sx={{ py: 2 }}>
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                gap={1}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: "bold",
                                    color: theme.palette.text.primary,
                                  }}
                                >
                                  {row.nombre}
                                </Typography>
                                {dataRecommended?.id === row.id && (
                                  <Chip
                                    icon={
                                      <RecommendIcon sx={{ fontSize: 16 }} />
                                    }
                                    label="Recomendada"
                                    size="small"
                                    sx={{
                                      background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.light} 90%)`,
                                      color: "white",
                                      fontWeight: "bold",
                                      fontSize: "0.7rem",
                                      "& .MuiChip-icon": {
                                        color: "white",
                                      },
                                    }}
                                  />
                                )}
                              </Box>
                            </TableCell>
                            {[
                              row.altura,
                              row.cuelloManga,
                              row.pecho,
                              row.cintura,
                              row.cadera,
                              row.entrepierna,
                            ].map((value, cellIndex) => (
                              <TableCell
                                key={cellIndex}
                                align="center"
                                sx={{
                                  py: 2,
                                  fontWeight: "medium",
                                  color: theme.palette.text.primary,
                                }}
                              >
                                {value}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            gap={2}
                          >
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                backgroundColor: alpha(
                                  theme.palette.text.disabled,
                                  0.1
                                ),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <InfoIcon />
                            </Box>
                            <Typography variant="body1" color="text.secondary">
                              No hay datos disponibles
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
