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
  Close,
  Download,
} from "@mui/icons-material";
import jsPDF from "jspdf";

import { getOrdersByUser } from "../../api/orderApi";
import { Order } from "../../types/order";
import logoDiamante from "/VummyLogo_Azul_Diamante.png";
import ErrorModal from "../../components/ErrorModal";

const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "entregado":
      return "success";
    case "enviado":
      return "warning";
    default:
      return "secondary";
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
    return new Date(dateString).toLocaleString("es-ES", {
      timeZone: "Europe/Madrid",
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

const generateOrderPDF = (order: Order) => {
  const img = new Image();
  img.src = logoDiamante;
  img.onload = () => {
    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
    });

    const primaryBlue = [25, 118, 210];
    const darkGray = [33, 33, 33];
    const lightGray = [245, 245, 245];
    const priceGreen = [76, 175, 80];

    doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.rect(0, 0, 210, 45, "F");

    doc.setFillColor(255, 255, 255);
    doc.circle(30, 22.5, 18, "F");
    doc.addImage(img, "PNG", 15, 7.5, 30, 30);

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    const titleText = "VUMMY APP";
    const titleWidth = doc.getTextWidth(titleText);
    const titleX = (210 - titleWidth) / 2;
    doc.text(titleText, titleX, 28);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const subtitleText = "Resumen de Pedido";
    const subtitleWidth = doc.getTextWidth(subtitleText);
    const subtitleX = (210 - subtitleWidth) / 2;
    doc.text(subtitleText, subtitleX, 36);

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(150, 8, 50, 12, 3, 3, "F");
    doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const orderLabel = `PEDIDO #${order.id}`;
    const orderWidth = doc.getTextWidth(orderLabel);
    doc.text(orderLabel, 150 + (50 - orderWidth) / 2, 16);

    let yPosition = 52;
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(15, yPosition, 180, 28, 3, 3, "F");

    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Comprador:", 20, yPosition + 7);
    doc.setFont("helvetica", "normal");
    doc.text(order.usuario.nombre || "Desconocido", 65, yPosition + 7);

    doc.setFont("helvetica", "bold");
    doc.text("Fecha del Pedido:", 20, yPosition + 14);
    doc.setFont("helvetica", "normal");
    doc.text(formatDate(order.fecha), 65, yPosition + 14);

    doc.setFont("helvetica", "bold");
    doc.text("Estado:", 20, yPosition + 21);
    doc.setFont("helvetica", "normal");
    const estado = order.estado || "Sin estado";
    if (estado.toLowerCase().includes("completado")) {
      doc.setTextColor(76, 175, 80);
    } else if (estado.toLowerCase().includes("pendiente")) {
      doc.setTextColor(255, 152, 0);
    } else {
      doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    }
    doc.text(estado, 65, yPosition + 21);

    yPosition += 40;
    doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.roundedRect(15, yPosition - 5, 180, 12, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("PRODUCTOS PEDIDOS", 20, yPosition + 3);

    yPosition += 15;
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    if (order.prendas && order.prendas.length > 0) {
      order.prendas.forEach((prenda) => {
        if (yPosition > 245) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
        doc.roundedRect(15, yPosition - 2, 180, 25, 3, 3, "F");

        doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
        doc.rect(15, yPosition - 2, 3, 25, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
        doc.text(prenda.prenda.nombre, 20, yPosition + 5);

        yPosition += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        let descripcion = prenda.prenda.descripcion;
        if (descripcion.length > 65) {
          descripcion = descripcion.substring(0, 65) + "...";
        }
        doc.text(descripcion, 20, yPosition + 4);

        yPosition += 8;
        doc.setFontSize(9);
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.text(prenda.prenda.tiendaNombre, 20, yPosition + 2);

        doc.setFillColor(priceGreen[0], priceGreen[1], priceGreen[2]);
        doc.roundedRect(85, yPosition - 1.5, 20, 7, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        const priceText = `${prenda.prenda.precio} €`;
        const priceWidth = doc.getTextWidth(priceText);
        doc.text(priceText, 85 + (20 - priceWidth) / 2, yPosition + 3);

        const qtyLabel = `CANTIDAD: ${prenda.cantidad}`;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        const qtyWidth = doc.getTextWidth(qtyLabel);
        const padding = 2;
        const rectWidth = qtyWidth + padding * 2;
        doc.setFillColor(priceGreen[0], priceGreen[1], priceGreen[2]);
        doc.roundedRect(110, yPosition - 1.5, rectWidth, 7, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        const textX = 110 + padding;
        doc.text(qtyLabel, textX, yPosition + 3);

        yPosition += 17;
      });
    }

    yPosition += 5;
    doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.roundedRect(120, yPosition - 6, 65, 20, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TOTAL:", 125, yPosition);

    doc.setFontSize(16);
    const totalText = order.total?.toLocaleString("es-ES", {
      style: "currency",
      currency: "EUR",
    });
    doc.text(totalText, 125, yPosition + 8);

    const footerY = 270;
    doc.setFillColor(255, 255, 255);
    doc.rect(0, footerY, 210, 27, "F");

    doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.setLineWidth(1);
    doc.line(20, footerY + 4, 190, footerY + 4);

    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      `Documento generado el ${new Date().toLocaleString("es-ES")}`,
      20,
      footerY + 12
    );
    doc.text("VUMMY APP - Tu tienda de confianza", 20, footerY + 18);

    doc.save(`Pedido${order.id}_Vummy_${order.usuario.nombre}.pdf`);
  };
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
        setError(
          `No se pudieron cargar los pedidos. Inténtalo de nuevo más tarde. ${error}`
        );
      } finally {
        setLoading(false);
      }
    };

    handleGetOrders();
  }, []);

  const openModal = (orderId: number) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const handleDownloadPDF = (order: Order) => {
    generateOrderPDF(order);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 3, px: { xs: 1, sm: 3 } }}>
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "text.primary",
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "1.1rem", md: "1.25rem" },
            }}
          >
            <ShoppingBag color="primary" />
            Mis Pedidos
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {[...Array(5)].map((_, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Skeleton
                variant="rectangular"
                height={80}
                sx={{ borderRadius: 1 }}
              />
            </Box>
          ))}
        </Paper>
      </Container>
    );
  }

  if (error) {
    return <ErrorModal error={error} />;
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 3, px: { xs: 1, sm: 3 } }}>
        <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}>
          <ShoppingBag
            sx={{ fontSize: { xs: 48, sm: 64 }, color: "text.disabled", mb: 2 }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "text.primary",
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "1rem", md: "1.25rem" },
              mb: 1,
            }}
          >
            No tienes pedidos aún.
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "0.85rem", md: "1rem" },
            }}
          >
            Cuando realices tu primer pedido, aparecerá aquí.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <>
      <Container
        maxWidth="md"
        sx={{ mt: { xs: 2, sm: 5 }, px: { xs: 1, sm: 3 } }}
      >
        <Paper elevation={2} sx={{ overflow: "hidden" }}>
          <Box
            sx={{
              p: { xs: 2, sm: 2.5 },
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
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
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                mt: 1,
                color: "white",
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "0.85rem", md: "1rem" },
              }}
            >
              {orders.length}{" "}
              {orders.length === 1
                ? "PEDIDO ENCONTRADO"
                : "PEDIDOS ENCONTRADOS"}
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
                    <Avatar
                      sx={{
                        bgcolor: "primary.light",
                        width: { xs: 40, sm: 50 },
                        height: { xs: 40, sm: 50 },
                      }}
                    >
                      {getStatusIcon(order.estado)}
                    </Avatar>
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="span"
                          sx={{
                            color: "text.primary",
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: { xs: "0.95rem", md: "1.1rem" },
                            fontWeight: 600,
                          }}
                        >
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
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <CalendarToday
                            sx={{
                              fontSize: { xs: 14, sm: 16 },
                              color: "text.disabled",
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: { xs: "0.75rem", md: "0.85rem" },
                            }}
                          >
                            {formatDate(order.fecha)}
                          </Typography>
                        </Box>
                        {order.total && (
                          <Typography
                            variant="body2"
                            color="primary"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: { xs: "0.85rem", md: "0.95rem" },
                              fontWeight: 600,
                            }}
                          >
                            TOTAL:{" "}
                            {order.total.toLocaleString("es-ES", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </Typography>
                        )}
                      </Box>
                    }
                  />

                  <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadPDF(order);
                      }}
                      sx={{
                        color: "success.main",
                      }}
                      title="Descargar PDF"
                    >
                      <Download sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(order.id);
                      }}
                    >
                      <Visibility
                        sx={{
                          color: "text.primary",
                          fontSize: { xs: 24, sm: 30 },
                        }}
                      />
                    </IconButton>
                  </Box>
                </ListItem>
                {index < orders.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
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
            sx: { backdropFilter: "blur(4px)" },
          },
        }}
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "95%", sm: "90%", md: 650 },
              maxHeight: "90vh",
              overflowY: "auto",
              bgcolor: "background.paper",
              borderRadius: 4,
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            }}
          >
            <Box
              sx={{
                bgcolor: "background.default",
                p: { xs: 2, sm: 3 },
                borderRadius: "16px 16px 0 0",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: { xs: 1.5, sm: 2 },
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: { xs: "1.2rem", md: "1.5rem" },
                      color: "text.primary",
                    }}
                  >
                    PEDIDO #{selectedOrder?.id}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      onClick={() =>
                        selectedOrder && generateOrderPDF(selectedOrder)
                      }
                      sx={{
                        color: "success.main",
                      }}
                      title="Descargar PDF"
                    >
                      <Download />
                    </IconButton>
                    <IconButton
                      onClick={closeModal}
                      sx={{
                        color: "text.primary",
                        bgcolor: "background.paper",
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      <Close />
                    </IconButton>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 1, sm: 2 },
                    flexWrap: "wrap",
                  }}
                >
                  <Chip
                    icon={
                      <CalendarToday sx={{ fontSize: { xs: 16, sm: 18 } }} />
                    }
                    label={
                      selectedOrder?.fecha && formatDate(selectedOrder.fecha)
                    }
                    sx={{
                      backgroundColor: "background.paper",
                      color: "text.primary",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: { xs: "0.7rem", md: "0.8rem" },
                      "& .MuiChip-label": {
                        px: { xs: 1, sm: 1.5 },
                      },
                    }}
                  />
                  <Chip
                    icon={getStatusIcon(selectedOrder?.estado)}
                    label={selectedOrder?.estado}
                    sx={{
                      backgroundColor: "background.paper",
                      color: "text.primary",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: { xs: "0.7rem", md: "0.8rem" },
                      "& .MuiChip-label": {
                        px: { xs: 1, sm: 1.5 },
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  color: "text.primary",
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: 3,
                  mb: 3,
                  textAlign: "center",
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                }}
              >
                <Typography
                  variant="body2"
                  color="white"
                  sx={{
                    opacity: 0.9,
                    mb: 0.5,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: { xs: "0.8rem", md: "0.9rem" },
                  }}
                >
                  TOTAL DEL PEDIDO
                </Typography>
                <Typography
                  variant="h4"
                  color="white"
                  sx={{
                    fontWeight: 700,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: { xs: "1.8rem", md: "2.125rem" },
                  }}
                >
                  {selectedOrder?.total?.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <ShoppingBag sx={{ color: "primary.main" }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: { xs: "1rem", md: "1.2rem" },
                    }}
                  >
                    Productos ({selectedOrder?.prendas?.length || 0})
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {selectedOrder?.prendas?.map((prenda) => (
                    <Box
                      key={prenda.id}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: { xs: 1.5, sm: 2 },
                        p: { xs: 2, sm: 2.5 },
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 3,
                        bgcolor: "background.default",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: { xs: "none", sm: "translateY(-2px)" },
                          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                          borderColor: "primary.main",
                        },
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Box>
                        <Box
                          component="img"
                          src={logoDiamante}
                          alt={prenda.prenda.nombre}
                          sx={{
                            width: { xs: 75, sm: 90 },
                            height: { xs: 75, sm: 90 },
                            ml: -1.5,
                            mt: 1.5,
                          }}
                        />
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 0.5,
                            color: "text.primary",
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

                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mb: 1.5,
                          }}
                        >
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

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Store
                            sx={{
                              fontSize: { xs: 16, sm: 18 },
                              color: "text.secondary",
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: { xs: "0.75rem", md: "0.85rem" },
                            }}
                          >
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
