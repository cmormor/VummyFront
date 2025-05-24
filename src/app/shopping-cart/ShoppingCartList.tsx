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
  CircularProgress,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ApiCartItem, CartItem } from "../../types/cart-item";
import { deleteCart, deleteCartPorId, getCartItems, putQuantity } from "../../api/cart-items";
import logoDiamante from "/VummyLogo_Azul_Diamante.png";
import { postOrder } from "../../api/orderApi";
import { PostOrder } from "../../types/order";

const CartItemSkeleton = () => (
  <Box sx={{ py: 1 }}>
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Skeleton variant="rounded" width={64} height={64} sx={{ mr: 2 }} />

      <Box flex={1}>
        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="40%" height={20} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="30%" height={18} />
      </Box>

      <Box display="flex" alignItems="center" gap={1} sx={{ mx: 2 }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" width={24} height={20} />
        <Skeleton variant="circular" width={32} height={32} />
      </Box>

      <Box textAlign="right" minWidth={90}>
        <Skeleton variant="text" width="100%" height={24} />
      </Box>

      <Box ml={2}>
        <Skeleton variant="circular" width={32} height={32} />
      </Box>
    </Box>
  </Box>
);

const CartSummarySkeleton = () => (
  <>
    <Divider sx={{ my: 2 }} />
    <Stack spacing={2} mb={2}>
      <Box display="flex" justifyContent="space-between">
        <Skeleton variant="text" width={60} height={20} />
        <Skeleton variant="text" width={50} height={20} />
      </Box>
      <Box display="flex" justifyContent="space-between" mt={1}>
        <Skeleton variant="text" width={80} height={28} />
        <Skeleton variant="text" width={100} height={28} />
      </Box>
    </Stack>
    <Skeleton variant="rounded" width="100%" height={56} />
  </>
);

export const ShoppingCartList = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderTotal, setOrderTotal] = useState(0);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [isPostingOrder, setIsPostingOrder] = useState(false);

  useEffect(() => {
    handleGetCartItems();
  }, []);

  const handleGetCartItems = async () => {
    setIsLoading(true);
    try {
      const itemsFromApi = await getCartItems();

      const mappedItems: CartItem[] = itemsFromApi.map((item: ApiCartItem) => ({
        ...item,
        prenda: {
          ...item.prenda,
          tallaNombre: item.talla?.nombre ?? "Desconocida",
        },
      }));

      setCartItems(mappedItems);

      const total = mappedItems.reduce((sum: number, item: CartItem) => {
        const precio = item.prenda.precio ?? 0;
        const cantidad = item.cantidad ?? 0;
        return sum + precio * cantidad;
      }, 0);

      setOrderTotal(total);
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostItems = async () => {
    setIsPostingOrder(true);

    const postCartItems: PostOrder = {
      prendas: cartItems
        .filter(item => item.prenda.id !== undefined && item.talla?.id !== undefined)
        .map(item => ({
          prenda: { id: item.prenda.id! },
          talla: { id: item.talla!.id! },
          cantidad: item.cantidad,
        })),
    };

    try {
      await postOrder(postCartItems);
      await handleClearCart();
    } catch (error) {
      console.error("Error al realizar el pedido:", error);
    } finally {
      setIsPostingOrder(false);
    }
  };

  const handleUpdateQuantity = async (id: number, newQty: number) => {
    if (newQty < 1) return;

    try {
      setUpdatingItemId(id);
      await putQuantity(id, newQty);

      const updatedItems = cartItems.map((item) =>
        item.id === id ? { ...item, cantidad: newQty } : item
      );

      setCartItems(updatedItems);

      const total = updatedItems.reduce((sum, item) => {
        const precio = item.prenda.precio ?? 0;
        const cantidad = item.cantidad ?? 0;
        return sum + precio * cantidad;
      }, 0);

      setOrderTotal(total);
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleClearCart = async () => {
    await deleteCart();
    await handleGetCartItems();
  };

  const handleDeleteItem = async (id: number) => {
    try {
      setUpdatingItemId(id);
      await deleteCartPorId(id);
      await handleGetCartItems();
    } catch (error) {
      console.error("Error al eliminar el item:", error);
    } finally {
      setUpdatingItemId(null);
    }
  };

  if (isLoading) {
    return (
      <Stack sx={{ maxWidth: 800, mx: "auto", width: "100%", p: 3 }}>
        <Paper
          elevation={3}
          sx={{
            maxHeight: 350,
            overflow: "auto",
            p: 2,
            mb: 2,
            borderRadius: 3,
          }}
        >
          <Stack spacing={2}>
            {Array.from({ length: 3 }).map((_, index) => (
              <CartItemSkeleton key={index} />
            ))}
          </Stack>
        </Paper>
        <CartSummarySkeleton />
      </Stack>
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
            {cartItems.map((item) => {
              const precio = item.prenda.precio ?? 0;
              const cantidad = item.cantidad ?? 0;
              const totalItem = precio * cantidad;
              return (
                <Box key={item.id} sx={{ py: 1, position: "relative" }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Avatar
                      src={logoDiamante}
                      alt={"Logo Diamante"}
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
                        {item.prenda.nombre}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: (theme) => theme.palette.text.primary,
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: { xs: "0.75rem", md: "1rem" },
                        }}
                      >
                        {precio.toLocaleString("es-ES", {
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
                        Talla: {item.prenda.tallaNombre}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateQuantity(item.id!, cantidad - 1)}
                        disabled={updatingItemId === item.id || isPostingOrder}
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
                        {cantidad}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateQuantity(item.id!, cantidad + 1)}
                        disabled={updatingItemId === item.id || isPostingOrder}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box textAlign="right" minWidth={90}>
                      <Typography
                        fontWeight="medium"
                        sx={{
                          color:
                            updatingItemId === item.id
                              ? (theme) => theme.palette.primary.main
                              : (theme) => theme.palette.text.primary,
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: { xs: "0.75rem", md: "1rem" },
                        }}
                      >
                        {totalItem.toLocaleString("es-ES", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </Typography>
                    </Box>

                    <Box ml={2}>
                      <IconButton
                        size="small"
                        color="error"
                        disabled={updatingItemId === item.id || isPostingOrder}
                        onClick={() => handleDeleteItem(item.id!)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Paper>
      )}

      {cartItems.length > 0 && (
        <>
          {(updatingItemId != null) && <LinearProgress sx={{ mt: 1 }} />}
          <Divider sx={{ my: 2 }} />
          <Stack spacing={2} mb={2}>
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
                }}
              >
                Total
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {orderTotal.toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                })}
              </Typography>
            </Box>
          </Stack>
          <Button
            disabled={isPostingOrder}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handlePostItems}
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "bold",
              py: 1.5,
              fontSize: { xs: "0.875rem", md: "1rem" },
            }}
          >
            {isPostingOrder ? (
              <Box display="flex" alignItems="center" gap={1} justifyContent="center" width="100%">
                <CircularProgress size={20} color="inherit" />
                Realizando compra...
              </Box>
            ) : (
              "Realizar compra"
            )}
          </Button>
        </>
      )}
    </Stack>
  );
};