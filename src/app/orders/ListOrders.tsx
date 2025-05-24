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
  IconButton,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import {
  ShoppingBag,
  CalendarToday,
  Receipt,
  LocalShipping,
  CheckCircle,
  Visibility,
  Store,
  Close
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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const handleGetOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedOrders: Order[] = await getOrdersByUser();

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

  const openModal = (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 3, px: { xs: 1, sm: 3 } }}>
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h5" component="h2"
            sx={{
              display: "flex", alignItems: "center",
              gap: 1,
              color: "text.primary",
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "1.1rem", md: "1.25rem" },
            }}>
            <ShoppingBag color="primary" />
            Mis Pedidos
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

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 3, px: { xs: 1, sm: 3 } }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 3, px: { xs: 1, sm: 3 } }}>
        <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}>
          <ShoppingBag sx={{ fontSize: { xs: 48, sm: 64 }, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" sx={{
            color: "text.primary",
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "1rem", md: "1.25rem" },
            mb: 1,
          }}>
            No tienes pedidos aún.
          </Typography>
          <Typography variant="body2" color="textSecondary"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "0.85rem", md: "1rem" },
            }}>
            Cuando realices tu primer pedido, aparecerá aquí.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 5 }, px: { xs: 1, sm: 3 } }}>
        <Paper elevation={2} sx={{ overflow: "hidden" }}>
          <Box sx={{
            p: { xs: 2, sm: 2.5 },
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}>
            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <ShoppingBag sx={{ fontSize: { xs: 32, sm: 50 } }} />
              <Box
                component="img"
                src={logoDiamante}
                alt="Logo"
                sx={{
                  height: { xs: 28, sm: 40 },
                  borderRadius: 2,
                  p: 0.5,
                  backgroundColor: "background.paper",
                  boxShadow: 1,
                }}
              />
            </Box>
            <Typography variant="body2" sx={{
              opacity: 0.9,
              mt: 1,
              color: "white",
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "0.85rem", md: "1rem" },
            }}>
              {orders.length} {orders.length === 1 ? "PEDIDO ENCONTRADO" : "PEDIDOS ENCONTRADOS"}
            </Typography>
          </Box>

          <List sx={{ p: 0 }}>
            {orders.map((order, index) => (
              <Box key={order.id || index}>
                <ListItem
                  onClick={() => openModal(order.id)}
                  sx={{
                    py: { xs: 1.5, sm: 2 },
                    px: { xs: 2, sm: 3 },
                    bgcolor: "background.paper",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: { xs: 60, sm: 80 } }}>
                    <Avatar sx={{
                      bgcolor: "primary.light",
                      width: { xs: 40, sm: 50 },
                      height: { xs: 40, sm: 50 }
                    }}>
                      {getStatusIcon(order.estado)}
                    </Avatar>
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
                        <Typography variant="h6" component="span" sx={{
                          color: "text.primary",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: { xs: "0.95rem", md: "1.1rem" },
                          fontWeight: 600,
                        }}>
                          Pedido #{order.id}
                        </Typography>
                        {order.estado && (
                          <Chip
                            label={order.estado}
                            size="small"
                            color={getStatusColor(order.estado)}
                            variant="outlined"
                            sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <CalendarToday sx={{ fontSize: { xs: 14, sm: 16 }, color: "text.disabled" }} />
                          <Typography variant="body2" color="textSecondary" sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: { xs: "0.75rem", md: "0.85rem" },
                          }}>
                            {formatDate(order.fecha)}
                          </Typography>
                        </Box>
                        {order.total && (
                          <Typography variant="body2" color="primary" sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: { xs: "0.85rem", md: "0.95rem" },
                            fontWeight: 600,
                          }}>
                            TOTAL: {order.total.toLocaleString("es-ES", {
                              style: "currency",
                              currency: "EUR"
                            })}
                          </Typography>
                        )}
                      </Box>
                    }
                  />

                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(order.id);
                    }}
                    sx={{ ml: "auto" }}
                  >
                    <Visibility sx={{
                      color: "text.primary",
                      fontSize: { xs: 24, sm: 30 }
                    }} />
                  </IconButton>
                </ListItem>
                {index < orders.length - 1 && <Divider variant="inset" component="li" />}
              </Box>
            ))}
          </List>
        </Paper>
      </Container>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            sx: { backdropFilter: 'blur(4px)' }
          },
        }}
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '95%', sm: '90%', md: 650 },
              maxHeight: '90vh',
              overflowY: 'auto',
              bgcolor: 'background.paper',
              borderRadius: 4,
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            }}
          >
            <Box
              sx={{
                bgcolor: 'background.default',
                p: { xs: 2, sm: 3 },
                borderRadius: '16px 16px 0 0',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: { xs: 1.5, sm: 2 },
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  gap: 1
                }}>
                  <Typography variant="h5" sx={{
                    fontWeight: 600,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: { xs: "1.2rem", md: "1.5rem" },
                    color: "text.primary",
                  }}>
                    PEDIDO #{selectedOrder?.id}
                  </Typography>
                  <IconButton
                    onClick={closeModal}
                    sx={{
                      color: 'text.primary',
                      bgcolor: 'background.paper',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <Close />
                  </IconButton>
                </Box>

                <Box sx={{
                  display: 'flex',
                  gap: { xs: 1, sm: 2 },
                  flexWrap: 'wrap'
                }}>
                  <Chip
                    icon={<CalendarToday sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                    label={selectedOrder?.fecha && formatDate(selectedOrder.fecha)}
                    sx={{
                      backgroundColor: 'background.paper',
                      color: 'text.primary',
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: { xs: "0.7rem", md: "0.8rem" },
                      '& .MuiChip-label': {
                        px: { xs: 1, sm: 1.5 }
                      }
                    }}
                  />
                  <Chip
                    icon={getStatusIcon(selectedOrder?.estado)}
                    label={selectedOrder?.estado}
                    sx={{
                      backgroundColor: 'background.paper',
                      color: 'text.primary',
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: { xs: "0.7rem", md: "0.8rem" },
                      '& .MuiChip-label': {
                        px: { xs: 1, sm: 1.5 }
                      }
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  color: 'text.primary',
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: 3,
                  mb: 3,
                  textAlign: 'center',
                  background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                }}
              >
                <Typography variant="body2" color="white" sx={{
                  opacity: 0.9,
                  mb: 0.5,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: { xs: "0.8rem", md: "0.9rem" },
                }}>
                  TOTAL DEL PEDIDO
                </Typography>
                <Typography variant="h4" color="white" sx={{
                  fontWeight: 700,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: { xs: "1.8rem", md: "2.125rem" },
                }}>
                  {selectedOrder?.total?.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <ShoppingBag sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" sx={{
                    fontWeight: 600,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: { xs: "1rem", md: "1.2rem" },
                  }}>
                    Productos ({selectedOrder?.prendas?.length || 0})
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {selectedOrder?.prendas?.map((prenda) => (
                    <Box
                      key={prenda.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: { xs: 1.5, sm: 2 },
                        p: { xs: 2, sm: 2.5 },
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 3,
                        bgcolor: 'background.default',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: { xs: 'none', sm: 'translateY(-2px)' },
                          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                          borderColor: 'primary.main',
                        },
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <Box sx={{ flexShrink: 0 }}>
                        <Box
                          component="img"
                          src={logoDiamante}
                          alt={prenda.prenda.nombre}
                          sx={{
                            width: { xs: 60, sm: 80 },
                            height: { xs: 60, sm: 80 },
                            borderRadius: 1,
                            objectFit: 'cover',
                          }}
                        />
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 0.5,
                            color: 'text.primary',
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: { xs: "0.9rem", md: "1rem" },
                          }}
                        >
                          {prenda.prenda.nombre}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 1.5,
                            lineHeight: 1.4,
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: { xs: "0.75rem", md: "0.85rem" },
                          }}
                        >
                          {prenda.prenda.descripcion}
                        </Typography>

                        <Box sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1,
                          mb: 1.5
                        }}>
                          <Chip
                            size="small"
                            label={`${prenda.prenda.precio}€`}
                            color="success"
                            variant="outlined"
                            sx={{
                              fontWeight: 600,
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: { xs: "0.7rem", md: "0.75rem" },
                            }}
                          />
                          <Chip
                            size="small"
                            label={`Cantidad: ${prenda.cantidad}`}
                            color="primary"
                            variant="outlined"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: { xs: "0.7rem", md: "0.75rem" },
                            }}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Store sx={{ fontSize: { xs: 16, sm: 18 }, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary" sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: { xs: "0.75rem", md: "0.85rem" },
                          }}>
                            {prenda.prenda.tiendaNombre}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};