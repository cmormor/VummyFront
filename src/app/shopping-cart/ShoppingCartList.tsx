import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  IconButton,
  Divider,
  Box,
  Paper,
  Stack,
  Avatar,
  LinearProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { getOrdersByUser } from "../../api/orderApi";
import { CartItem } from "../../types/cart-item";
import logoDiamante from "/VummyLogo_Azul_Diamante.png";
import { Loading } from "../../components/Loading";
import { updateOrderItemQuantity } from "../../api/order-clotheApi";

export const ShoppingCartList = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderTotal, setOrderTotal] = useState(0);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  useEffect(() => {
    handleGetCartItems();
  }, []);

  const handleGetCartItems = async () => {
    setIsLoading(true);
    try {
      const orders = await getOrdersByUser();
      const cartItems: CartItem[] = [];
      let total = 0;

      orders.forEach((order) => {
        total += order.total;
        order.prendas.forEach((prenda) => {
          cartItems.push({
            id: prenda.id,
            name: prenda.prenda.nombre,
            image: prenda.prenda.imagen?.toString() || "",
            price: prenda.prenda.precio,
            tallaName: prenda.talla.nombre,
            quantity: prenda.cantidad,
          });
        });
      });

      setCartItems(cartItems);
      setOrderTotal(total);
    } catch (error) {
      console.error("Error al obtener los pedidos del usuario:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: number, newQty: number) => {
    if (newQty < 1) return;

    try {
      // Marcamos el item como actualizando
      setUpdatingItemId(id);

      await updateOrderItemQuantity(id, newQty);

      setCartItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item
        )
      );

      setOrderTotal((prevTotal) => {
        const item = cartItems.find((item) => item.id === id);
        if (!item) return prevTotal;
        return prevTotal - item.price * item.quantity + item.price * newQty;
      });
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error);
    } finally {
      // Quitamos el estado de actualizando
      setUpdatingItemId(null);
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={6}>
        <Loading />
        <Typography
          mt={2}
          sx={{
            color: (theme) => theme.palette.text.primary,
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "0.75rem", md: "1rem" },
          }}
        >
          Cargando pedidos...
        </Typography>
      </Box>
    );
  }

  return (
    <Stack sx={{ maxWidth: 800, mx: "auto", width: "100%", p: 3 }}>
      {cartItems.length === 0 ? (
        <Box
          textAlign="center"
          py={6}
          sx={{
            backgroundColor: (theme) => theme.palette.background.paper,
            borderRadius: 2,
          }}
        >
          <ShoppingCartIcon
            sx={{
              fontSize: 64,
              color: (theme) => theme.palette.primary.main,
              mb: 2,
            }}
          />
          <Typography
            sx={{
              color: (theme) => theme.palette.text.primary,
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "0.75rem", md: "1rem" },
              p: 1,
            }}
          >
            Añade algunos productos para continuar con la compra
          </Typography>
        </Box>
      ) : (
        <Paper
          elevation={3}
          sx={{
            maxHeight: 350,
            overflow: "auto",
            p: 2,
            mb: 2,
            borderRadius: 3,
            "&::-webkit-scrollbar": { width: 8 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: (theme) => theme.palette.background.paper,
              borderRadius: 4,
            },
          }}
        >
          <Stack spacing={2}>
            {cartItems.map((item) => (
              <Box
                key={item.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ py: 1 }}
              >
                <Avatar
                  src={logoDiamante}
                  alt="Vummy Logo"
                  variant="rounded"
                  sx={{ width: 64, height: 64, mr: 2 }}
                />

                <Box flex={1}>
                  <Typography
                    fontWeight="medium"
                    sx={{
                      color: (theme) => theme.palette.text.primary,
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: { xs: "0.75rem", md: "1rem" },
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: (theme) => theme.palette.text.primary,
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: { xs: "0.75rem", md: "1rem" },
                    }}
                  >
                    {item.price.toLocaleString("es-ES", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: (theme) => theme.palette.text.secondary,
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: { xs: "0.7rem", md: "0.9rem" },
                    }}
                  >
                    Talla: {item.tallaName}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton
                    size="small"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <Typography
                    width={24}
                    textAlign="center"
                    sx={{
                      color: (theme) => theme.palette.text.primary,
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: { xs: "0.75rem", md: "1rem" },
                    }}
                  >
                    {item.quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box textAlign="right" minWidth={90}>
                  <Typography
                    fontWeight="medium"
                    sx={{
                      color: updatingItemId === item.id ? "primary.main" : "text.primary",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: { xs: "0.75rem", md: "1rem" },
                    }}
                  >
                    {(item.price * item.quantity).toLocaleString("es-ES", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </Typography>
                  {updatingItemId === item.id}
                </Box>

                <Box ml={2}>
                  <IconButton size="small" color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}

      {cartItems.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={1} mb={2}>
            <Box display="flex" justifyContent="space-between">
              <Typography
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: { xs: "0.75rem", md: "1rem" },
                }}
              >
                Subtotal
              </Typography>
              <Typography
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: { xs: "0.75rem", md: "1rem" },
                }}
              >
                {orderTotal.toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                })}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: { xs: "0.75rem", md: "1rem" },
                }}
              >
                Envío
              </Typography>
              <Typography
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: { xs: "0.75rem", md: "1rem" },
                }}
              >
                Gratis
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography
                variant="h6"
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: { xs: "0.75rem", md: "1rem" },
                }}
              >
                Total
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: updatingItemId !== null ? "primary.main" : "text.primary",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: { xs: "0.75rem", md: "1rem" },
                }}
              >
                {orderTotal.toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                })}
              </Typography>
            </Box>
          </Stack>
          {updatingItemId !== null && (
            <LinearProgress
              sx={{
                mb: 2,
              }}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ borderRadius: 2, py: 1.5, fontWeight: "bold" }}
          >
            REALIZAR PEDIDO
          </Button>
        </>
      )}
    </Stack>
  );
};
