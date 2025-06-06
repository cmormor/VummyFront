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
  postSizes,
  updateStore,
} from "../../api/storeApi";
import { getSizesByStore } from "../../api/size-clothe";
import { ModalConfirmation } from "../../components/ModalConfirmation";
import * as yup from "yup";
import { Size } from "../../types/size";

const sizeSchema = yup.object().shape({
  nombre: yup
    .mixed<"S" | "M" | "L" | "XL">()
    .oneOf(["S", "M", "L", "XL"], "La talla debe ser S, M, L o XL")
    .required("El nombre de la talla es obligatorio"),
  altura: yup
    .number()
    .min(1, "La altura debe ser mayor o igual a 0")
    .required("La altura es obligatoria"),
  cuelloManga: yup
    .number()
    .min(0, "El cuello/manga debe ser mayor o igual a 0")
    .required("El cuello/manga es obligatorio"),
  pecho: yup
    .number()
    .min(0, "El pecho debe ser mayor o igual a 0")
    .required("El pecho es obligatorio"),
  cintura: yup
    .number()
    .min(0, "La cintura debe ser mayor o igual a 0")
    .required("La cintura es obligatoria"),
  cadera: yup
    .number()
    .min(0, "La cadera debe ser mayor o igual a 0")
    .required("La cadera es obligatoria"),
  entrepierna: yup
    .number()
    .min(0, "La entrepierna debe ser mayor o igual a 0")
    .required("La entrepierna es obligatoria"),
});

const schema = yup.object().shape({
  nombre: yup
    .string()
    .trim()
    .min(3, "Mínimo 3 caracteres")
    .required("El nombre es obligatorio")
    .min(1, "El nombre no puede estar vacío"),
  descripcion: yup
    .string()
    .trim()
    .min(3, "Mínimo 3 caracteres")
    .max(50, "Máximo 50 caracteres")
    .required("La descripción es obligatoria")
    .min(1, "La descripción no puede estar vacía"),
  tallas: yup
    .array()
    .of(sizeSchema)
    .optional()
    .test(
      "unique-sizes",
      "No se pueden repetir las tallas",
      function (tallas) {
        if (!tallas || tallas.length === 0) return true;
        const nombres = tallas.map((t) => t?.nombre).filter(Boolean);
        const uniqueNombres = new Set(nombres);
        return nombres.length === uniqueNombres.size;
      }
    )
    .test(
      "max-sizes",
      "No se pueden agregar más de 4 tallas (S, M, L, XL)",
      function (tallas) {
        if (!tallas) return true;
        return tallas.length <= 4;
      }
    ),
});

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
    tallas: [],
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
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
    } catch (error: any) {
      showSnackbar(`Error al cargar las tiendas: ${error}`, "error");
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
  }, [searchTerm, storeList]);

  const handleOpenDialog = async (
    mode: "create" | "edit" | "view",
    store?: Store
  ) => {
    setDialogMode(mode);
    if (store) {
      setSelectedStore(store);

      if (mode === "view" || mode === "edit") {
        try {
          // 1) Traer tallas filtradas por storeId
          const sizes = await getSizesByStore(store.id!);

          // 2) llenar formData.tallas con esas tallas
          setFormData(() => ({
            id: store.id,
            nombre: store.nombre,
            descripcion: store.descripcion,
            prendas: store.prendas || [],
            tallas: sizes,
          }));

          // 3) obtener datos completos de la tienda (prendas, etc.)
          const fullStore = await getStoreById(store.id!);
          setFormData((prev) => ({
            ...prev,
            id: fullStore!.id,
            nombre: fullStore!.nombre,
            descripcion: fullStore!.descripcion,
            prendas: fullStore!.prendas || [],
            // tallas ya viene de above
          }));
        } catch (error: any) {
          setFormData({
            id: store.id,
            nombre: store.nombre,
            descripcion: store.descripcion,
            prendas: store.prendas || [],
            tallas: [],
          });
          showSnackbar(
            `Error al cargar detalles o tallas de la tienda: ${error}`,
            "warning"
          );
        }
      }
    } else {
      // Modo crear
      setSelectedStore(null);
      setFormData({
        nombre: "",
        descripcion: "",
        prendas: [],
        tallas: [],
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
      tallas: [],
    });
  };

  const handleInputChange = (field: keyof Store, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateTallas = async (tallas: Size[]): Promise<string[]> => {
    const errors: string[] = [];

    for (let i = 0; i < tallas.length; i++) {
      const talla = tallas[i];
      if (!talla.id) {
        try {
          await sizeSchema.validate(talla, { abortEarly: false });
        } catch (validationError: any) {
          if (validationError instanceof yup.ValidationError) {
            validationError.inner.forEach((err) => {
              errors.push(`Talla ${talla.nombre} - ${err.message}`);
            });
          }
        }
      }
    }

    const nombres = tallas.map((t) => t.nombre);
    const duplicados = nombres.filter(
      (n, idx) => nombres.indexOf(n) !== idx
    );
    if (duplicados.length > 0) {
      errors.push(
        `Hay tallas duplicadas: ${[...new Set(duplicados)].join(", ")}`
      );
    }

    return errors;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await schema.validate(formData, { abortEarly: false });

      if (formData.tallas && formData.tallas.length > 0) {
        const tallaErrors = await validateTallas(formData.tallas);
        if (tallaErrors.length > 0) {
          showSnackbar(
            `Errores en las tallas: ${tallaErrors.join(". ")}`,
            "error"
          );
          return;
        }
      }

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

        if (formData.tallas && formData.tallas.length > 0) {
          for (const talla of formData.tallas) {
            if (!talla.id) {
              const data = {
                ...talla,
                tienda: { id: newStore.id! },
              };
              await postSizes(data);
            }
          }
        }

        showSnackbar("Tienda creada exitosamente", "success");
      } else if (dialogMode === "edit") {
        if (!selectedStore) {
          showSnackbar(
            "No se ha seleccionado ninguna tienda para editar.",
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
    } catch (validationError: any) {
      if (validationError instanceof yup.ValidationError) {
        const primerMensaje =
          validationError.inner[0]?.message || validationError.message;
        showSnackbar(primerMensaje, "error");
        return;
      }
      showSnackbar(`Error inesperado: ${validationError}`, "error");
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

      const updatedList = storeList.filter((s) => s.id !== storeToDelete);
      setStoreList(updatedList);
      setFilteredStore(updatedList);

      showSnackbar("Tienda eliminada exitosamente", "success");
    } catch (error: any) {
      showSnackbar(`Error al eliminar la tienda: ${error}`, "error");
    } finally {
      setLoading(false);
      setOpenModal(false);
      setStoreToDelete(null);
      setMensaje("");
    }
  };

  const handleAddTalla = () => {
    const nombresExistentes = formData.tallas?.map((t) => t.nombre) ?? [];

    const opcionesDisponibles: Size["nombre"][] = ["S", "M", "L", "XL"].filter(
      (n) => !nombresExistentes.includes(n)
    );

    if (opcionesDisponibles.length === 0) {
      showSnackbar("Ya se agregaron todas las tallas", "warning");
      return;
    }

    const siguienteTalla = opcionesDisponibles[0];

    setFormData((prev) => ({
      ...prev,
      tallas: [
        ...(prev.tallas ?? []),
        {
          nombre: siguienteTalla,
          altura: 0,
          cuelloManga: 0,
          pecho: 0,
          cintura: 0,
          cadera: 0,
          entrepierna: 0,
        },
      ],
    }));
  };

  const handleRemoveTalla = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tallas: prev.tallas?.filter((_, i) => i !== index) ?? [],
    }));
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
        maxWidth="md"
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

            <Divider sx={{ my: 2 }} />

            <Alert
              severity="warning"
              variant="outlined"
              sx={{
                width: "100%",
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              LAS TALLAS SOLO SE PUEDEN ASIGNAR DURANTE LA CREACIÓN DE LA TIENDA
            </Alert>

            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                }}
              >
                Tallas
              </Typography>
              {dialogMode === "create" && (
                <Button
                  onClick={handleAddTalla}
                  variant="outlined"
                  startIcon={<Add />}
                  sx={{
                    textTransform: "none",
                    fontFamily: "'Poppins', sans-serif",
                    borderRadius: 2,
                  }}
                >
                  Agregar talla
                </Button>
              )}
            </Box>

            {formData.tallas && formData.tallas.length > 0 ? (
              formData.tallas.map((talla, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 5,
                    mb: 2,
                    position: "relative",
                    borderRadius: 2,
                    border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    background: (theme) => alpha(theme.palette.primary.light, 0.02),
                  }}
                >
                  {dialogMode === "create" && !talla.id && (
                    <IconButton
                      onClick={() => handleRemoveTalla(index)}
                      size="small"
                      color="error"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 1,
                      }}
                    >
                      <Close />
                    </IconButton>
                  )}

                  <Stack spacing={2}>
                    <TextField
                      label="Talla"
                      value={talla.nombre}
                      onChange={(e) => {
                        const newTallas = [...(formData.tallas || [])];
                        newTallas[index] = {
                          ...talla,
                          nombre: e.target.value as "S" | "M" | "L" | "XL",
                        };
                        handleInputChange("tallas", newTallas);
                      }}
                      select
                      SelectProps={{ native: true }}
                      disabled={dialogMode === "view" || !!talla.id}
                      sx={{
                        background: (theme) => theme.palette.background.paper,
                        fontFamily: "'Poppins', sans-serif'",
                        fontSize: { xs: "0.9rem", md: "1rem" },
                      }}
                    >
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </TextField>

                    <Box
                      display="grid"
                      gridTemplateColumns={{
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                      }}
                      gap={2}
                    >
                      {[
                        { label: "Altura", field: "altura" },
                        { label: "Cuello/Manga", field: "cuelloManga" },
                        { label: "Pecho", field: "pecho" },
                        { label: "Cintura", field: "cintura" },
                        { label: "Cadera", field: "cadera" },
                        { label: "Entrepierna", field: "entrepierna" },
                      ].map(({ label, field }) => (
                        <TextField
                          key={field}
                          label={label}
                          type="number"
                          value={talla[field as keyof Size]}
                          onChange={(e) => {
                            const newTallas = [...(formData.tallas || [])];
                            newTallas[index] = {
                              ...talla,
                              [field]: parseFloat(e.target.value) || 0,
                            };
                            handleInputChange("tallas", newTallas);
                          }}
                          disabled={dialogMode === "view" || !!talla.id}
                          sx={{
                            background: (theme) => theme.palette.background.paper,
                            fontFamily: "'Poppins', sans-serif'",
                            fontSize: { xs: "0.9rem", md: "1rem" },
                          }}
                          inputProps={{ min: 0, step: 0.1 }}
                        />
                      ))}
                    </Box>
                  </Stack>
                </Paper>
              ))
            ) : (
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 2,
                  border: (theme) => `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                  background: (theme) => alpha(theme.palette.primary.light, 0.05),
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontFamily: "'Poppins', sans-serif'",
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                >
                  {dialogMode === "create"
                    ? "No hay tallas agregadas. Haz clic en 'Agregar talla' para comenzar."
                    : "Esta tienda no tiene tallas configuradas."}
                </Typography>
              </Paper>
            )}
          </Stack>
        </DialogContent>

        {dialogMode !== "view" && (
          <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
            <Button
              onClick={handleCloseDialog}
              color="inherit"
              sx={{
                fontFamily: "'Poppins', sans-serif'",
                fontSize: { xs: "0.9rem", md: "1rem" },
                textTransform: "none",
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
                fontFamily: "'Poppins', sans-serif'",
                fontSize: { xs: "0.9rem", md: "1rem" },
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              {dialogMode === "create" ? "Crear" : "Guardar"}
            </Button>
          </DialogActions>
        )}

        {snackbar.severity !== "success" && (
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() =>
              setSnackbar((prev) => ({ ...prev, open: false }))
            }
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            sx={{
              zIndex: 1100,
            }}
          >
            <Alert
              onClose={() =>
                setSnackbar((prev) => ({ ...prev, open: false }))
              }
              severity={snackbar.severity}
              variant="filled"
              sx={{
                width: "100%",
                fontFamily: "'Poppins', sans-serif'",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        )}
      </Dialog>

      {snackbar.severity === "success" && (
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
              fontFamily: "'Poppins', sans-serif'",
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}

      <ModalConfirmation
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmDelete}
        mensaje={mensaje}
      />
    </Box>
  );
};
