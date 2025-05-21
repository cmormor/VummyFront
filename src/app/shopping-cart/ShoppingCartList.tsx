"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Divider,
  Badge,
  Box,
  Paper,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export const ShoppingCartList = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Camiseta Premium",
      price: 29.99,
      quantity: 1,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "2",
      name: "Pantalones Vaqueros",
      price: 49.99,
      quantity: 2,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "3",
      name: "Zapatillas Deportivas",
      price: 89.99,
      quantity: 1,
      image: "/placeholder.svg?height=80&width=80",
    },
  ]);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <Card sx={{ maxWidth: 800, mx: "auto", width: "100%", p: 2 }}>
      <CardHeader
        title={
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h5" fontWeight="bold" textAlign="center">
              Tu Carrito
            </Typography>
          </Box>
        }
        action={
          <Badge
            badgeContent={cartItems.reduce(
              (sum, item) => sum + item.quantity,
              0
            )}
            color="primary"
            sx={{ mr: 2, "& .MuiBadge-badge": { fontSize: "0.8rem" } }}
          >
            <ShoppingCartIcon />
          </Badge>
        }
        sx={{ pb: 2 }}
      />

      <CardContent sx={{ pt: 0 }}>
        {cartItems.length === 0 ? (
          <Box textAlign="center" py={4}>
            <ShoppingCartIcon
              sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6">Tu carrito está vacío</Typography>
            <Typography color="text.secondary">
              Añade algunos productos para continuar con la compra
            </Typography>
          </Box>
        ) : (
          <Paper
            sx={{
              maxHeight: 320,
              overflow: "auto",
              pr: 1,
              px: 2,
              py: 1,
              "&::-webkit-scrollbar": { width: 8 },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,0.2)",
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
                  <Box flex={1}>
                    <Typography fontWeight="medium">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.price.toLocaleString("es-ES", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography width={32} textAlign="center">
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box textAlign="right" minWidth={110}>
                    <Typography fontWeight="medium">
                      {(item.price * item.quantity).toLocaleString("es-ES", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </Typography>
                  </Box>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeItem(item.id)}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          </Paper>
        )}
      </CardContent>

      {cartItems.length > 0 && (
        <>
          <Divider />
          <CardContent>
            <Stack spacing={1}>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography>
                  {totalPrice.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Envío</Typography>
                <Typography>Gratis</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">
                  {totalPrice.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </Typography>
              </Box>
            </Stack>
          </CardContent>

          <CardActions sx={{ px: 2, pt: 0 }}>
            <Button variant="contained" color="primary" fullWidth size="large">
              Proceder al pago
            </Button>
          </CardActions>
        </>
      )}
    </Card>
  );
};
