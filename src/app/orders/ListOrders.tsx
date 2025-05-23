import { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Typography,
  Divider,
  Box,
  Chip,
  Skeleton,
  Alert,
  Container,
  Avatar,
} from "@mui/material";
import {
  ShoppingBag,
  CalendarToday,
  Receipt,
  LocalShipping,
  CheckCircle,
} from "@mui/icons-material";
import { getOrdersByUser } from "../../api/orderApi";
import { Order } from "../../types/order";
import logoDiamante from "/VummyLogo_Azul_Diamante.png";


const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "entregado":
      return "success";
    case "enviado":
      return "warning";
    default:
      return "default";
  }
};

const getStatusIcon = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "entregado":
      return <CheckCircle />;
    case "enviado":
      return <LocalShipping />;
    default:
      return <Receipt />;
  }
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

export const ListOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleGetOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedOrders: Order[] = await getOrdersByUser();
        console.log("Órdenes recibidas:", fetchedOrders);

        fetchedOrders.sort((a, b) => b.id - a.id);

        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error al obtener las órdenes:", error);
        setError("No se pudieron cargar los pedidos. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    handleGetOrders();
  }, []);


  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" component="h2"
            sx={{
              display: "flex", alignItems: "center",
              gap: 1,
              color: (theme) => theme.palette.text.primary,
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "0.75rem", md: "1rem" },
            }}>
            <ShoppingBag color="primary" />
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {[...Array(5)].map((_, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
            </Box>
          ))}
        </Paper>
      </Container>
    );
  }

  //TODO: ADD ERROR IN OTHERS COMPONENTS

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
          <ShoppingBag sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" sx={{
            color: (theme) => theme.palette.text.primary,
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "0.75rem", md: "1rem" },
            mb: 1,
          }}>
            No tienes pedidos aún.
          </Typography>
          <Typography variant="body2" color="textSecondary"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "0.75rem", md: "1rem" },
            }}>
            Cuando realices tu primer pedido, aparecerá aquí.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={2} sx={{ overflow: "hidden" }}>
        <Box sx={{
          p: 3,
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}>
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <ShoppingBag sx={{ fontSize: 50 }} />
            <Box
              component="img"
              src={logoDiamante}
              alt="Logo"
              sx={{
                height: 40,
                borderRadius: 2,
                p: 0.5,
                backgroundColor: (theme) => theme.palette.background.paper,
                boxShadow: 1,
              }}
            />
          </Box>
          <Typography variant="body2" sx={{
            opacity: 0.9, mt: 1,
            color: (theme) => theme.palette.text.primary,
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "0.75rem", md: "1rem" },
          }}>
            {orders.length} {orders.length === 1 ? "pedido encontrado" : "pedidos encontrados"}
          </Typography>
        </Box>


        <List sx={{ p: 0 }}>
          {orders.map((order, index) => (
            <Box key={order.id || index}>
              <ListItem
                sx={{
                  py: 2,
                  px: 3,
                  bgcolor: (theme) => theme.palette.background.paper,
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: "primary.light", mr: 5, width: 50, height: 50 }}>
                    {getStatusIcon(order.estado)}
                  </Avatar>
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Typography variant="h6" component="span" sx={{
                        color: (theme) => theme.palette.text.primary,
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: { xs: "0.75rem", md: "1rem" },
                      }}>
                        Pedido #{order.id}
                      </Typography>
                      {order.estado && (
                        <Chip
                          label={order.estado}
                          size="small"
                          color={getStatusColor(order.estado)}
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <CalendarToday sx={{ fontSize: 16, color: "text.disabled" }} />
                        <Typography variant="body2" color="textSecondary" sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: { xs: "0.75rem", md: "1rem" },
                        }}>
                          {formatDate(order.fecha)}
                        </Typography>
                      </Box>
                      {order.total && (
                        <Typography variant="body2" color="primary" sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: { xs: "0.75rem", md: "1rem" },
                          textDecoration: "underline",
                          textUnderlineOffset: "4px",
                        }}>
                          TOTAL: {order.total.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                        </Typography>

                      )}
                    </Box>
                  }
                />
              </ListItem>

              {index < orders.length - 1 && <Divider variant="inset" component="li" />}
            </Box>
          ))}
        </List>
      </Paper>
    </Container>
  );
};