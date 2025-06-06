import {
  Box,
  Paper,
  alpha,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  Stack,
  InputAdornment,
  Chip,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Edit,
  Delete,
  Visibility,
  Close,
  Search,
  Clear,
  CheckCircle,
  Receipt,
  LocalShipping,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { ModalConfirmation } from "../../components/ModalConfirmation";
import { Order } from "../../types/order";
import {
  deleteOrder,
  getOrderById,
  getOrders,
  updateStatusOrder,
} from "../../api/orderApi";

export const OrdersSettings = () => {
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [filteredOrder, setFilteredOrder] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const [dialogMode, setDialogMode] = useState<"view" | "edit">("view");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState<Order>({
    id: 0,
    usuario: {
      id: 0,
      nombre: "",
    },
    fecha: "",
    estado: "",
    total: 0,
    prendas: [],
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const validStatus = ["CONFIRMADO", "ENVIADO", "ENTREGADO"];

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const orders = await getOrders();
      orders.sort((a, b) => a.estado!.localeCompare(b.estado!));
      setOrderList(orders);
      setFilteredOrder(orders);
    } catch (error) {
      showSnackbar(`Error al cargar los pedidos ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOrder(orderList);
    } else {
      const term = searchTerm.toLowerCase();

      const filtered = orderList.filter(
        (order) =>
          (order.usuario.nombre || "").toLowerCase().includes(term) ||
          (order.estado || "").toLowerCase().includes(term) ||
          (order.total?.toString() || "").includes(term) ||
          (order.fecha || "").toLowerCase().includes(term)
      );

      setFilteredOrder(filtered);
    }
  }, [searchTerm, orderList, selectedOrder]);

  const handleOpenDialog = async (mode: "view" | "edit", order?: Order) => {
    setDialogMode(mode);
    if (order) {
      setSelectedOrder(order);

      if (mode === "view" || mode === "edit") {
        try {
          const fullOrder = await getOrderById(order.id!);
          setFormData({
            id: fullOrder!.id,
            usuario: {
              id: fullOrder!.usuario.id,
              nombre: fullOrder!.usuario.nombre,
            },
            fecha: fullOrder!.fecha,
            estado: fullOrder!.estado,
            total: fullOrder!.total,
          });
        } catch (error) {
          setFormData({
            id: order!.id,
            usuario: {
              id: order!.usuario.id,
              nombre: order!.usuario.nombre,
            },
            fecha: order!.fecha,
            estado: order!.estado,
            total: order!.total,
          });
          showSnackbar(
            `Error al cargar detalles completos del pedido ${error}`,
            "warning"
          );
        }
      }
    } else {
      setSelectedOrder(null);
      setFormData({
        id: 0,
        usuario: {
          id: 0,
          nombre: "",
        },
        fecha: "",
        estado: "",
        total: 0,
        prendas: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
    setFormData({
      id: 0,
      usuario: {
        id: 0,
        nombre: "",
      },
      fecha: "",
      estado: "",
      total: 0,
      prendas: [],
    });
  };

  const handleInputChange = (field: keyof Order, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (dialogMode === "edit") {
        if (!selectedOrder) {
          showSnackbar(
            "No se ha seleccionado ningún pedido para editar.",
            "error"
          );
          setLoading(false);
          return;
        }

        const estadoVal = formData.estado.toUpperCase();

        if (!validStatus.includes(estadoVal)) {
          showSnackbar(
            "Estado inválido. Debe ser CONFIRMADO, ENVIADO o ENTREGADO.",
            "error"
          );
          setLoading(false);
          return;
        }

        await updateStatusOrder(selectedOrder.id!, estadoVal);
        await loadOrders();
        showSnackbar("Estado actualizado exitosamente", "success");
      }

      handleCloseDialog();
    } catch (error) {
      showSnackbar(`Error al procesar la solicitud ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (orderId: number, order: string) => {
    setOrderToDelete(orderId);
    setMensaje(
      `¿Estás seguro de que deseas eliminar el pedido "${order}"? Esta acción no se puede deshacer.`
    );
    setOpenModal(true);
  };

  const handleConfirmDelete = async () => {
    if (orderToDelete === null) return;

    setLoading(true);
    try {
      await deleteOrder(orderToDelete);

      const updatedList = orderList.filter(
        (order) => order.id !== orderToDelete
      );
      setOrderList(updatedList);
      setFilteredOrder(updatedList);

      showSnackbar("Pedido eliminado exitosamente", "success");
    } catch (error) {
      showSnackbar(`Error al eliminar el pedido ${error}`, "error");
    } finally {
      setLoading(false);
      setOpenModal(false);
      setOrderToDelete(null);
      setMensaje("");
    }
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const getDialogTitle = () => {
    switch (dialogMode) {
      case "edit":
        return "CAMBIAR ESTADO DE PEDIDO";
      case "view":
        return "PEDIDO" + (selectedOrder ? ` ${selectedOrder.id}` : "");
      default:
        return "PEDIDO";
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
  return (
    <Box sx={{ mt: 2, maxWidth: 1200 }}>
      <Paper
        elevation={4}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(
              theme.palette.info.light,
              0.08
            )} 0%, ${alpha(theme.palette.info.dark, 0.05)} 100%)`,
          border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box display="flex" alignItems="center">
            <Receipt
              sx={{
                mr: 2,
                color: (theme) => theme.palette.info.main,
                fontSize: "1.8rem",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                fontWeight: 600,
                color: (theme) => theme.palette.info.main,
              }}
            >
              LISTA DE PEDIDOS
            </Typography>
          </Box>
        </Box>

        <Divider
          sx={{
            mb: 3,
            bgcolor: (theme) => alpha(theme.palette.info.main, 0.3),
            height: 2,
            borderRadius: 1,
          }}
        />

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Buscar pedido por nombre, estado..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            variant="outlined"
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="primary" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={clearSearch} edge="end">
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                background: (theme) => theme.palette.background.paper,
                border: (theme) => `1px solid ${theme.palette.info.main}`,
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "0.9rem", md: "1rem" },
              },
            }}
          />
          {searchTerm && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                ml: 1,
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              {filteredOrder.length} pedido{" "}
              {filteredOrder.length !== 1 ? "s" : ""} encontrado
              {filteredOrder.length !== 1 ? "s" : ""}
            </Typography>
          )}
        </Box>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={8}
          >
            <CircularProgress size={40} />
            <Typography
              variant="body1"
              sx={{
                ml: 2,
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              Cargando pedidos...
            </Typography>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={2}
            sx={{ borderRadius: 2 }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  }}
                >
                  <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Comprador</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrder.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.usuario.nombre}</TableCell>
                    <TableCell>{formatDate(order.fecha)}</TableCell>
                    <TableCell>
                      {order.estado === "CONFIRMADO" ? (
                        <Chip
                          label="CONFIRMADO"
                          color="secondary"
                          icon={<Receipt />}
                          variant="outlined"
                          size="small"
                          sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: { xs: "0.7rem", md: "0.9rem" },
                            p: 1,
                          }}
                        />
                      ) : order.estado === "ENVIADO" ? (
                        <Chip
                          label="ENVIADO"
                          color="warning"
                          icon={<LocalShipping />}
                          variant="outlined"
                          size="small"
                          sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: { xs: "0.7rem", md: "0.9rem" },
                            p: 1,
                          }}
                        />
                      ) : (
                        <Chip
                          label="ENTREGADO"
                          color="success"
                          icon={<CheckCircle />}
                          variant="outlined"
                          size="small"
                          sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: { xs: "0.7rem", md: "0.9rem" },
                            p: 1,
                          }}
                        />
                      )}
                    </TableCell>

                    <TableCell>{order.total.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleOpenDialog("view", order)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog("edit", order)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDeleteClick(
                                order.id!,
                                `Pedido # ${order.id}`
                              )
                            }
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOrder.length === 0 && searchTerm && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Stack alignItems="center" spacing={1}>
                        <Search sx={{ fontSize: 48, color: "text.disabled" }} />
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: { xs: "0.9rem", md: "1rem" },
                          }}
                        >
                          No se encontraron pedidos
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.disabled"
                          sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: { xs: "0.9rem", md: "1rem" },
                          }}
                        >
                          Intenta con otros términos de búsqueda
                        </Typography>
                        <Button
                          size="small"
                          onClick={clearSearch}
                          sx={{ mt: 1 }}
                        >
                          Limpiar búsqueda
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
                {orderList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: { xs: "0.9rem", md: "1rem" },
                        }}
                      >
                        No hay pedidos creados
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <ModalConfirmation
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmDelete}
        mensaje={mensaje}
      />

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: (theme) => theme.palette.background.default,
            border: (theme) => `1px solid ${theme.palette.info.main}`,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                fontFamily: "'Lexend Zetta', sans-serif",
                fontSize: { xs: "1.2rem", md: "1.3rem" },
              }}
            >
              {getDialogTitle()}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {dialogMode === "view" && (
              <>
                <TextField
                  label="ID"
                  value={formData.id}
                  onChange={(e) =>
                    handleInputChange("id", parseInt(e.target.value) || 0)
                  }
                  fullWidth
                  disabled
                  required
                  sx={{
                    background: (theme) => theme.palette.background.paper,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                />

                <TextField
                  label="Comprador"
                  value={formData.usuario.nombre}
                  onChange={(e) =>
                    handleInputChange("usuario", {
                      ...formData.usuario,
                      nombre: e.target.value,
                    })
                  }
                  fullWidth
                  disabled
                  required
                  rows={3}
                  sx={{
                    background: (theme) => theme.palette.background.paper,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                />

                <TextField
                  label="Fecha"
                  type="text"
                  value={formatDate(formData.fecha)}
                  onChange={(e) => handleInputChange("fecha", e.target.value)}
                  fullWidth
                  disabled
                  required
                  sx={{
                    background: (theme) => theme.palette.background.paper,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                />

                <TextField
                  label="Total"
                  type="number"
                  value={formData.total.toFixed(2)}
                  onChange={(e) =>
                    handleInputChange("total", parseFloat(e.target.value) || 0)
                  }
                  fullWidth
                  disabled
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">€</InputAdornment>
                    ),
                  }}
                  sx={{
                    background: (theme) => theme.palette.background.paper,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                />

                {(() => {
                  const pedidoSeleccionado = orderList.find((order) => order.id === formData.id);

                  if (!pedidoSeleccionado || !Array.isArray(pedidoSeleccionado.prendas)) {
                    return (
                      <Box
                        sx={{
                          p: 3,
                          textAlign: 'center',
                          border: (theme) => `1px dashed ${theme.palette.divider}`,
                          borderRadius: 1,
                          backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.05),
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: { xs: "0.85rem", md: "0.9rem" },
                          }}
                        >
                          No hay prendas para este pedido
                        </Typography>
                      </Box>
                    );
                  }

                  return (
                    <Box
                      sx={{
                        maxHeight: 200,
                        overflowY: 'auto',
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        p: 1,
                        backgroundColor: (theme) => theme.palette.background.paper,
                      }}
                    >
                      {pedidoSeleccionado.prendas.map((item, index) => (
                        <Box
                          key={item.id || index}
                          sx={{
                            py: 0.5,
                            px: 1,
                            mb: 1,
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: { xs: "0.85rem", md: "0.9rem" },
                              }}
                            >
                              {item?.prenda?.nombre || 'Nombre no disponible'}
                            </Typography>
                            {item?.prenda?.descripcion && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  fontFamily: "'Poppins', sans-serif",
                                  fontSize: { xs: "0.75rem", md: "0.8rem" },
                                }}
                              >
                                {item.prenda.descripcion}
                              </Typography>
                            )}
                            {item?.talla?.nombre && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  fontFamily: "'Poppins', sans-serif",
                                  fontSize: { xs: "0.75rem", md: "0.8rem" },
                                  display: 'block',
                                }}
                              >
                                Talla: {item.talla.nombre}
                              </Typography>
                            )}
                          </Box>
                          <Divider sx={{ mt: 1 }} />
                        </Box>
                      ))}
                    </Box>
                  );
                })()}
              </>
            )}

            {dialogMode === "edit" ? (
              <>
                <InputLabel
                  id="estado-label"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  ESTADO
                </InputLabel>
                <Select
                  labelId="estado-label"
                  id="estado-select"
                  value={formData.estado}
                  label="Estado"
                  onChange={(e) => handleInputChange("estado", e.target.value)}
                  sx={{
                    background: (theme) => theme.palette.background.paper,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                  fullWidth
                  required
                >
                  <MenuItem value="CONFIRMADO">CONFIRMADO</MenuItem>
                  <MenuItem value="ENVIADO">ENVIADO</MenuItem>
                  <MenuItem value="ENTREGADO">ENTREGADO</MenuItem>
                </Select>
              </>
            ) : (
              <TextField
                label="Estado"
                value={formData.estado}
                fullWidth
                disabled
                sx={{
                  background: (theme) => theme.palette.background.paper,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
              />
            )}
          </Stack>
        </DialogContent>

        {dialogMode !== "view" && (
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleCloseDialog}
              color="inherit"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={
                loading ||
                !formData.id ||
                !formData.usuario.nombre ||
                !formData.fecha ||
                !formData.estado
              }
              startIcon={loading && <CircularProgress size={16} />}
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              Guardar
            </Button>
          </DialogActions>
        )}
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 10 }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
