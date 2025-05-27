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
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Close,
  Search,
  Clear,
  Cases,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Clothe } from "../../types/clothe";
import {
  deleteClothe,
  getClotheById,
  getClothes,
  postClothe,
  updateClothe,
} from "../../api/clotheApi";
import { ModalConfirmation } from "../../components/ModalConfirmation";

export const ClotheSettings = () => {
  const [clotheList, setClotheList] = useState<Clothe[]>([]);
  const [filteredClothe, setFilteredClothe] = useState<Clothe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [clotheToDelete, setClotheToDelete] = useState<number | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedClothe, setSelectedClothe] = useState<Clothe | null>(null);
  const [formData, setFormData] = useState<Clothe>({
    nombre: "",
    precio: 0,
    descripcion: "",
    stock: 0,
    tiendaId: 0,
    tallaNombre: "",
    tiendaNombre: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  useEffect(() => {
    loadClothe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadClothe = async () => {
    try {
      setLoading(true);
      const clothes = await getClothes();
      clothes.sort((a, b) => a.tiendaNombre!.localeCompare(b.tiendaNombre!));
      setClotheList(clothes);
      setFilteredClothe(clothes);
    } catch (error) {
      showSnackbar(`Error al cargar las prendas ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredClothe(clotheList);
    } else {
      const term = searchTerm.toLowerCase();

      const filtered = clotheList.filter(
        (clothe) =>
          (clothe.nombre || "").toLowerCase().includes(term) ||
          (clothe.descripcion || "").toLowerCase().includes(term) ||
          (clothe.precio?.toString() || "").toLowerCase().includes(term) ||
          (clothe.tiendaNombre || "").toLowerCase().includes(term)
      );

      setFilteredClothe(filtered);
    }
  }, [searchTerm, clotheList, selectedClothe]);

  const handleOpenDialog = async (
    mode: "create" | "edit" | "view",
    clothe?: Clothe
  ) => {
    setDialogMode(mode);
    if (clothe) {
      setSelectedClothe(clothe);

      if (mode === "view" || mode === "edit") {
        try {
          const fullClothe = await getClotheById(clothe.id!);
          setFormData({
            id: fullClothe!.id,
            nombre: fullClothe!.nombre,
            descripcion: fullClothe!.descripcion,
            precio: fullClothe!.precio,
            stock: fullClothe!.stock,
            tallaNombre: fullClothe!.tallaNombre,
            tallaId: fullClothe!.tallaId,
            tiendaNombre: fullClothe!.tiendaNombre,
            tiendaId: fullClothe!.tiendaId,
            imagen: fullClothe!.imagen,
          });
        } catch (error) {
          setFormData({
            id: clothe!.id,
            nombre: clothe!.nombre,
            descripcion: clothe!.descripcion,
            precio: clothe!.precio,
            stock: clothe!.stock,
            tallaNombre: clothe!.tallaNombre,
            tallaId: clothe!.tallaId,
            tiendaNombre: clothe!.tiendaNombre,
            tiendaId: clothe!.tiendaId,
            imagen: clothe!.imagen,
          });
          showSnackbar(
            `Error al cargar detalles completos de la prenda ${error}`,
            "warning"
          );
        }
      }
    } else {
      setSelectedClothe(null);
      setFormData({
        nombre: "",
        precio: 0,
        descripcion: "",
        stock: 0,
        tiendaId: 0,
        tallaNombre: "",
        tiendaNombre: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClothe(null);
    setFormData({
      nombre: "",
      precio: 0,
      descripcion: "",
      stock: 0,
      tiendaId: 0,
      tallaNombre: "",
      tiendaNombre: "",
    });
  };

  const handleInputChange = (field: keyof Clothe, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (dialogMode === "create") {
        const response = await postClothe(formData);
        if (typeof response === "string") {
          showSnackbar(response, "error");
          return;
        }
        const newClothe = response as Clothe;
        const updatedList = [...clotheList, newClothe];
        setClotheList(updatedList);
        setFilteredClothe(updatedList);
        showSnackbar("Teinda creada exitosamente", "success");
      } else if (dialogMode === "edit") {
        if (!selectedClothe) {
          showSnackbar(
            "No se ha seleccionado ningúna prenda para editar.",
            "error"
          );
          setLoading(false);
          return;
        }

        const data: Partial<Clothe> = { id: selectedClothe.id };

        if (formData.nombre !== "") data.nombre = formData.nombre;
        if (formData.precio && !isNaN(Number(formData.precio)))
          data.precio = Number(formData.precio);
        if (formData.stock && !isNaN(Number(formData.stock)))
          data.stock = Number(formData.stock);
        if (formData.tallaNombre !== "")
          data.tallaNombre = formData.tallaNombre;
        if (formData.tiendaId && !isNaN(Number(formData.tiendaId)))
          data.tiendaId = Number(formData.tiendaId);
        if (formData.tiendaNombre !== "")
          data.tiendaNombre = formData.tiendaNombre;
        if (formData.tallaId && !isNaN(Number(formData.tallaId)))
          data.tallaId = Number(formData.tallaId);
        if (formData.descripcion !== "")
          data.descripcion = formData.descripcion;

        await updateClothe(selectedClothe.id!, data);
        await loadClothe();
        showSnackbar("Tienda actualizada exitosamente", "success");
      }

      handleCloseDialog();
    } catch (error) {
      showSnackbar(`Error al procesar la solicitud ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (clotheId: number, clothe: string) => {
    setClotheToDelete(clotheId);
    setMensaje(
      `¿Estás seguro de que deseas eliminar la prenda "${clothe}"? Esta acción no se puede deshacer.`
    );
    setOpenModal(true);
  };

  const handleConfirmDelete = async () => {
    if (clotheToDelete === null) return;

    setLoading(true);
    try {
      await deleteClothe(clotheToDelete);

      const updatedList = clotheList.filter(
        (clothe) => clothe.id !== clotheToDelete
      );
      setClotheList(updatedList);
      setFilteredClothe(updatedList);

      showSnackbar("Prenda eliminado exitosamente", "success");
    } catch (error) {
      showSnackbar(`Error al eliminar la Prenda ${error}`, "error");
    } finally {
      setLoading(false);
      setOpenModal(false);
      setClotheToDelete(null);
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
        return "AÑADIR PRENDA";
      case "edit":
        return "EDITAR PRENDA";
      case "view":
        return "PRENDA";
      default:
        return "PRENDA";
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
            <Cases
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
              LISTA DE PRENDAS
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
            Nueva Prenda
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
            placeholder="Buscar prenda por nombre, descripción..."
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
              {filteredClothe.length} prenda{" "}
              {filteredClothe.length !== 1 ? "s" : ""} encontrado
              {filteredClothe.length !== 1 ? "s" : ""}
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
              Cargando prendas...
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
                  <TableCell sx={{ fontWeight: "bold" }}>Precio</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Stock</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Tienda</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClothe.map((clothe) => (
                  <TableRow key={clothe.id} hover>
                    <TableCell>{clothe.nombre}</TableCell>
                    <TableCell>{clothe.precio}</TableCell>
                    <TableCell>{clothe.descripcion}</TableCell>
                    <TableCell>
                      {clothe.stock > 0 ? (
                        <Chip
                          label="STOCK"
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
                      ) : (
                        <Chip
                          label="SIN STOCK"
                          color="error"
                          icon={<Cancel />}
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

                    <TableCell>{clothe.tiendaNombre}</TableCell>
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
                            onClick={() => handleOpenDialog("view", clothe)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog("edit", clothe)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDeleteClick(clothe.id!, clothe.nombre)
                            }
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredClothe.length === 0 && searchTerm && (
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
                          No se encontraron prendas
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
                {clotheList.length === 0 && (
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
                        No hay prendas creadas
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
            <TextField
              label="Nombre de la prenda"
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
              value={formData.descripcion}
              onChange={(e) => handleInputChange("descripcion", e.target.value)}
              fullWidth
              disabled={dialogMode === "view"}
              required
              multiline
              rows={3}
              sx={{
                background: (theme) => theme.palette.background.paper,
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            />

            <TextField
              label="Precio"
              type="number"
              value={formData.precio}
              onChange={(e) =>
                handleInputChange("precio", parseFloat(e.target.value) || 0)
              }
              fullWidth
              disabled={dialogMode === "view"}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              sx={{
                background: (theme) => theme.palette.background.paper,
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            />

            <TextField
              label="ID de la tienda"
              type="number"
              value={formData.tiendaId}
              onChange={(e) =>
                handleInputChange("tiendaId", parseInt(e.target.value) || 0)
              }
              fullWidth
              disabled={dialogMode === "view"}
              required
              inputProps={{ min: 1 }}
              sx={{
                background: (theme) => theme.palette.background.paper,
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            />

            {dialogMode === "view" && (
              <>
                <TextField
                  label="Nombre de la tienda"
                  value={formData.tiendaNombre}
                  onChange={(e) =>
                    handleInputChange("tiendaNombre", e.target.value)
                  }
                  fullWidth
                  disabled={dialogMode === "view"}
                  required
                  sx={{
                    background: (theme) => theme.palette.background.paper,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                />
              </>
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
              disabled={loading || !formData.nombre || !formData.descripcion}
              startIcon={loading && <CircularProgress size={16} />}
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              {dialogMode === "create" ? "Crear" : "Guardar"}
            </Button>
          </DialogActions>
        )}
      </Dialog>

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
    </Box>
  );
};
