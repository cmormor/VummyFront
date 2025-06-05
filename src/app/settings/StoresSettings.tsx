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
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Close,
  Search,
  Clear,
  ReceiptLong,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Store } from "../../types/store";
import {
  createStore,
  deleteStore,
  getStoreById,
  getStores,
  updateStore,
} from "../../api/storeApi";
import { ModalConfirmation } from "../../components/ModalConfirmation";

export const StoresSettings = () => {
  const [storeList, setStoreList] = useState<Store[]>([]);
  const [filteredStore, setFilteredStore] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [storeToDelete, setStoreToDelete] = useState<number | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState<Store>({
    nombre: "",
    descripcion: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  useEffect(() => {
    loadStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
      const stores = await getStores();
      stores.sort((a, b) => a.nombre!.localeCompare(b.nombre!));
      setStoreList(stores);
      setFilteredStore(stores);
    } catch (error) {
      showSnackbar(`Error al cargar las tiendas ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStore(storeList);
    } else {
      const filtered = storeList.filter(
        (store) =>
          store.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          store.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStore(filtered);
    }
  }, [searchTerm, storeList, selectedStore]);

  const handleOpenDialog = async (
    mode: "create" | "edit" | "view",
    store?: Store
  ) => {
    setDialogMode(mode);
    if (store) {
      setSelectedStore(store);

      if (mode === "view" || mode === "edit") {
        try {
          const fullStore = await getStoreById(store.id!);

          setFormData({
            id: fullStore!.id,
            nombre: fullStore!.nombre,
            descripcion: fullStore!.descripcion,
            prendas: fullStore!.prendas || [],
          });
        } catch (error) {
          setFormData({
            id: store.id,
            nombre: store.nombre,
            descripcion: store.descripcion,
            prendas: store.prendas || [],
          });
          showSnackbar(
            `Error al cargar detalles completos de la tienda ${error}`,
            "warning"
          );
        }
      }
    } else {
      setSelectedStore(null);
      setFormData({
        nombre: "",
        descripcion: "",
        prendas: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStore(null);
    setFormData({
      nombre: "",
      descripcion: "",
    });
  };

  const handleInputChange = (field: keyof Store, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (dialogMode === "create") {
        const response = await createStore(formData);
        if (typeof response === "string") {
          showSnackbar(response, "error");
          return;
        }
        const newStore = response as Store;
        const updatedList = [...storeList, newStore];
        setStoreList(updatedList);
        setFilteredStore(updatedList);
        showSnackbar("Tienda creada exitosamente", "success");
      } else if (dialogMode === "edit") {
        if (!selectedStore) {
          showSnackbar(
            "No se ha seleccionado ningúna tienda para editar.",
            "error"
          );
          setLoading(false);
          return;
        }

        const data: Partial<Store> = { id: selectedStore.id };

        if (formData.nombre !== "") data.nombre = formData.nombre;
        if (formData.descripcion !== "")
          data.descripcion = formData.descripcion;

        await updateStore(selectedStore.id!, data);
        await loadStores();
        showSnackbar("Tienda actualizada exitosamente", "success");
      }

      handleCloseDialog();
    } catch (error) {
      showSnackbar(`Error al procesar la solicitud ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (storeId: number, tienda: string) => {
    setStoreToDelete(storeId);
    setMensaje(
      `¿Estás seguro de que deseas eliminar la tienda "${tienda}"? Esta acción no se puede deshacer.`
    );
    setOpenModal(true);
  };

  const handleConfirmDelete = async () => {
    if (storeToDelete === null) return;

    setLoading(true);
    try {
      await deleteStore(storeToDelete);

      const updatedList = storeList.filter(
        (store) => store.id !== storeToDelete
      );
      setStoreList(updatedList);
      setFilteredStore(updatedList);

      showSnackbar("Tienda eliminado exitosamente", "success");
    } catch (error) {
      showSnackbar(`Error al eliminar la tienda ${error}`, "error");
    } finally {
      setLoading(false);
      setOpenModal(false);
      setStoreToDelete(null);
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
      case "create":
        return "CREAR TIENDA";
      case "edit":
        return "EDITAR TIENDA";
      case "view":
        return "TIENDA";
      default:
        return "TIENDA";
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
            <ReceiptLong
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
              LISTA DE TIENDAS
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog("create")}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Nueva Tienda
          </Button>
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
            placeholder="Buscar tiendas por nombre o descripción..."
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
              {filteredStore.length} tienda{" "}
              {filteredStore.length !== 1 ? "s" : ""} encontrado
              {filteredStore.length !== 1 ? "s" : ""}
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
              Cargando tiendas...
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
                  <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStore.map((store) => (
                  <TableRow key={store.id} hover>
                    <TableCell>{store.nombre}</TableCell>
                    <TableCell>{store.descripcion}</TableCell>
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
                            onClick={() => handleOpenDialog("view", store)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog("edit", store)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDeleteClick(store.id!, store.nombre)
                            }
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredStore.length === 0 && searchTerm && (
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
                          No se encontraron tiendas
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
                {storeList.length === 0 && (
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
                        No hay tiendas creadas
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

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
                  type="number"
                  value={formData.id}
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
                  label="Prendas"
                  type="text"
                  value={
                    formData.prendas
                      ? formData.prendas.map((p) => p.nombre).join("\n")
                      : ""
                  }
                  fullWidth
                  disabled
                  sx={{
                    background: (theme) => theme.palette.background.paper,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                  multiline
                  rows={Math.min(formData.prendas?.length || 2, 6)}
                />
              </>
            )}

            <TextField
              label="Nombre completo"
              value={formData.nombre}
              onChange={(e) => handleInputChange("nombre", e.target.value)}
              fullWidth
              disabled={dialogMode === "view"}
              required
              sx={{
                background: (theme) => theme.palette.background.paper,
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            />

            <TextField
              label="Descripción"
              type="text"
              value={formData.descripcion}
              onChange={(e) => handleInputChange("descripcion", e.target.value)}
              fullWidth
              disabled={dialogMode === "view"}
              required
              sx={{
                background: (theme) => theme.palette.background.paper,
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            />
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
              disabled={loading || !formData.nombre || !formData.descripcion}
              startIcon={loading && <CircularProgress size={16} />}
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              {dialogMode === "create" ? "Crear" : "Guardar"}
            </Button>
            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
          </DialogActions>
        )}
      </Dialog>

      <ModalConfirmation
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmDelete}
        mensaje={mensaje}
      />
    </Box>
  );
};
