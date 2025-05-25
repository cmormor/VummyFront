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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Tooltip,
    Alert,
    Snackbar,
    CircularProgress,
    Stack,
    InputAdornment,
} from "@mui/material";
import {
    RecentActors,
    Add,
    Edit,
    Delete,
    Visibility,
    Close,
    Search,
    Clear,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Usuario } from "../../types/user";
import { createUsuario, deleteUser, getUsuarioById, getUsuarios, updateUsuario } from "../../api/userApi";

interface UserFormData {
    id?: number;
    nombre: string;
    email: string;
    password?: string;
    rol?: string;
    altura: number;
    cuelloManga: number;
    pecho: number;
    cintura: number;
    cadera: number;
    entrepierna: number;
}

export const UsersSettings = () => {
    const [userList, setUserList] = useState<Usuario[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<Usuario[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
    const [selectedUser, setSelectedUser] = useState<UserFormData | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        nombre: '',
        email: '',
        rol: '',
        altura: 0,
        cuelloManga: 0,
        pecho: 0,
        cintura: 0,
        cadera: 0,
        entrepierna: 0
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'warning' | 'info'
    });

    useEffect(() => {
        loadUsuarios();
    }, []);

    const loadUsuarios = async () => {
        try {
            setLoading(true);
            const usuarios = await getUsuarios();
            usuarios.sort((a, b) => a.rol!.localeCompare(b.rol!));
            setUserList(usuarios);
            setFilteredUsers(usuarios);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            showSnackbar('Error al cargar los usuarios', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredUsers(userList);
        } else {
            const filtered = userList.filter(user =>
                user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.rol && user.rol.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredUsers(filtered);
        }
    }, [searchTerm, userList, selectedUser]);

    const handleOpenDialog = async (mode: 'create' | 'edit' | 'view', user?: Usuario) => {
        setDialogMode(mode);
        if (user) {
            setSelectedUser(user);

            if (mode === 'view' || mode === 'edit') {
                try {
                    const fullUser = await getUsuarioById(user.id!);
                    setFormData({
                        id: fullUser.id,
                        nombre: fullUser.nombre,
                        email: fullUser.email,
                        rol: fullUser.rol,
                        altura: fullUser.altura,
                        cuelloManga: fullUser.cuelloManga,
                        pecho: fullUser.pecho,
                        cintura: fullUser.cintura,
                        cadera: fullUser.cadera,
                        entrepierna: fullUser.entrepierna
                    });
                } catch (error) {
                    console.error('Error al cargar detalles del usuario:', error);
                    setFormData({
                        id: user.id,
                        nombre: user.nombre,
                        email: user.email,
                        rol: user.rol,
                        altura: user.altura,
                        cuelloManga: user.cuelloManga,
                        pecho: user.pecho,
                        cintura: user.cintura,
                        cadera: user.cadera,
                        entrepierna: user.entrepierna
                    });
                    showSnackbar('Error al cargar detalles completos del usuario', 'warning');
                }
            }
        } else {
            setSelectedUser(null);
            setFormData({
                nombre: '',
                email: '',
                rol: '',
                altura: 0,
                cuelloManga: 0,
                pecho: 0,
                cintura: 0,
                cadera: 0,
                entrepierna: 0
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
        setFormData({
            nombre: '',
            email: '',
            rol: '',
            altura: 0,
            cuelloManga: 0,
            pecho: 0,
            cintura: 0,
            cadera: 0,
            entrepierna: 0
        });
    };

    const handleInputChange = (field: keyof UserFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCreate = async (usuario: Usuario) => {
        const response = await createUsuario(usuario);
        return response;
    };

    const handleUpdate = async (data: Partial<Usuario>) => {
        const response = await updateUsuario(data);
        return response;
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (dialogMode === "create") {
                const response = await handleCreate(formData);
                if (typeof response === "string") {
                    showSnackbar(response, "error");
                    return;
                }
                const newUser = response as Usuario;
                const updatedList = [...userList, newUser];
                setUserList(updatedList);
                setFilteredUsers(updatedList);
                showSnackbar("Usuario creado exitosamente", "success");
            } else if (dialogMode === "edit") {
                if (!selectedUser) {
                    showSnackbar("No se ha seleccionado ningún usuario para editar.", "error");
                    setLoading(false);
                    return;
                }

                const dataToUpdate: Partial<Usuario> = {};

                if (formData.nombre && formData.nombre !== selectedUser.nombre)
                    dataToUpdate.nombre = formData.nombre;
                if (formData.email && formData.email !== selectedUser.email)
                    dataToUpdate.email = formData.email;
                if (formData.rol && formData.rol !== selectedUser.rol)
                    dataToUpdate.rol = formData.rol;
                if (formData.altura !== selectedUser.altura)
                    dataToUpdate.altura = formData.altura;
                if (formData.cuelloManga !== selectedUser.cuelloManga)
                    dataToUpdate.cuelloManga = formData.cuelloManga;
                if (formData.pecho !== selectedUser.pecho)
                    dataToUpdate.pecho = formData.pecho;
                if (formData.cintura !== selectedUser.cintura)
                    dataToUpdate.cintura = formData.cintura;
                if (formData.cadera !== selectedUser.cadera)
                    dataToUpdate.cadera = formData.cadera;
                if (formData.entrepierna !== selectedUser.entrepierna)
                    dataToUpdate.entrepierna = formData.entrepierna;

                if (Object.keys(dataToUpdate).length === 0) {
                    showSnackbar("No has introducido ningún dato para actualizar.", "error");
                    setLoading(false);
                    return;
                }

                await handleUpdate(dataToUpdate);
                await loadUsuarios();

                showSnackbar("Usuario actualizado exitosamente", "success");
            }

            handleCloseDialog();
        } catch (error) {
            showSnackbar("Error al procesar la solicitud", "error");
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (userId: number) => {
        setLoading(true);
        try {
            await deleteUser(userId);

            const updatedList = userList.filter(user => user.id !== userId);
            setUserList(updatedList);
            setFilteredUsers(updatedList);

            showSnackbar('Usuario eliminado exitosamente', 'success');
        } catch (error: any) {
            showSnackbar('Error al eliminar al usuario', 'error');
        } finally {
            setLoading(false);
        }
    };


    const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    const getDialogTitle = () => {
        switch (dialogMode) {
            case 'create': return 'CREAR USUARIO';
            case 'edit': return 'EDITAR USUARIO';
            case 'view': return 'USUARIO';
            default: return 'Usuario';
        }
    };

    const getRolColor = (rol?: string) => {
        if (!rol) return 'default';
        switch (rol.toLowerCase()) {
            case 'ADMINISTRADOR': return 'error';
            case 'REGISTRADO': return 'warning';
            case 'TIENDA_USER': return 'info';
            default: return 'default';
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
                    background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.info.light, 0.08)} 0%, ${alpha(theme.palette.info.dark, 0.05)} 100%)`,
                    border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                }}
            >
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center">
                        <RecentActors
                            sx={{
                                mr: 2,
                                color: (theme) => theme.palette.info.main,
                                fontSize: '1.8rem',
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
                            LISTA DE USUARIOS
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog('create')}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Nuevo Usuario
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
                        placeholder="Buscar usuarios por nombre, email o rol..."
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
                                    <IconButton
                                        size="small"
                                        onClick={clearSearch}
                                        edge="end"
                                    >
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
                            }
                        }}
                    />
                    {searchTerm && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 1, ml: 1, fontFamily: "'Poppins', sans-serif",
                                fontSize: { xs: "0.9rem", md: "1rem" },
                            }}
                        >
                            {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
                        </Typography>
                    )}
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" py={8}>
                        <CircularProgress size={40} />
                        <Typography variant="body1" sx={{
                            ml: 2, fontFamily: "'Poppins', sans-serif",
                            fontSize: { xs: "0.9rem", md: "1rem" },
                        }}>
                            Cargando usuarios...
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Rol</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id} hover>
                                        <TableCell>{user.nombre}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.rol || 'Sin rol'}
                                                color={getRolColor(user.rol) as any}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Tooltip title="Ver detalles">
                                                    <IconButton
                                                        size="small"
                                                        color="info"
                                                        onClick={() => handleOpenDialog('view', user)}
                                                    >
                                                        <Visibility />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Editar">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleOpenDialog('edit', user)}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Eliminar">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDelete(user.id!)}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredUsers.length === 0 && searchTerm && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                            <Stack alignItems="center" spacing={1}>
                                                <Search sx={{ fontSize: 48, color: 'text.disabled' }} />
                                                <Typography variant="body1" color="text.secondary" sx={{
                                                    fontFamily: "'Poppins', sans-serif",
                                                    fontSize: { xs: "0.9rem", md: "1rem" },
                                                }}>
                                                    No se encontraron usuarios
                                                </Typography>
                                                <Typography variant="body2" color="text.disabled" sx={{
                                                    fontFamily: "'Poppins', sans-serif",
                                                    fontSize: { xs: "0.9rem", md: "1rem" },
                                                }}>
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
                                {userList.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                            <Typography variant="body2" color="text.secondary" sx={{
                                                fontFamily: "'Poppins', sans-serif",
                                                fontSize: { xs: "0.9rem", md: "1rem" },
                                            }}>
                                                No hay usuarios registrados
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
                        border: (theme) => `1px solid ${(theme.palette.info.main)}`,
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" fontWeight={600} sx={{
                            fontFamily: "'Lexend Zetta', sans-serif",
                            fontSize: { xs: "1.2rem", md: "1.3rem" },
                        }}>
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
                            label="Nombre completo"
                            value={formData.nombre}
                            onChange={(e) => handleInputChange('nombre', e.target.value)}
                            fullWidth
                            disabled={dialogMode === 'view'}
                            required
                            sx={{
                                background: (theme) => theme.palette.background.paper, fontFamily: "'Poppins', sans-serif",
                                fontSize: { xs: "0.9rem", md: "1rem" },
                            }}
                        />

                        <TextField
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            fullWidth
                            disabled={dialogMode === 'view'}
                            required
                            sx={{
                                background: (theme) => theme.palette.background.paper, fontFamily: "'Poppins', sans-serif",
                                fontSize: { xs: "0.9rem", md: "1rem" },
                            }}
                        />

                        {dialogMode === 'create' && (
                            <TextField
                                label="Contraseña"
                                type="password"
                                value={formData.password || ''}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                fullWidth
                                required
                                helperText="La contraseña es requerida para crear un nuevo usuario"
                                sx={{
                                    background: (theme) => theme.palette.background.paper, fontFamily: "'Poppins', sans-serif",
                                    fontSize: { xs: "0.9rem", md: "1rem" },
                                }}
                            />
                        )}

                        <FormControl fullWidth disabled={dialogMode === 'view'}>
                            <InputLabel>Rol</InputLabel>
                            <Select
                                value={formData.rol || ''}
                                label="Rol"
                                onChange={(e) => handleInputChange('rol', e.target.value)}
                                sx={{ background: (theme) => theme.palette.background.paper, }}
                            >
                                <MenuItem value="ADMINISTRADOR" sx={{
                                    fontFamily: "'Poppins', sans-serif",
                                    fontSize: { xs: "0.9rem", md: "1rem" },
                                }}>ADMINISTRADOR</MenuItem>
                                <MenuItem value="REGISTRADO" sx={{
                                    fontFamily: "'Poppins', sans-serif",
                                    fontSize: { xs: "0.9rem", md: "1rem" },
                                }}>REGISTRADO</MenuItem>
                                <MenuItem value="TIENDA_USER" sx={{
                                    fontFamily: "'Poppins', sans-serif",
                                    fontSize: { xs: "0.9rem", md: "1rem" },
                                }}>VISITANTE</MenuItem>
                            </Select>
                        </FormControl>

                        <Typography variant="h6" color="primary" sx={{
                            mt: 2, fontFamily: "'Poppins', sans-serif",
                            fontSize: { xs: "0.9rem", md: "1rem" },
                        }}>
                            Medidas Corporales
                        </Typography>

                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Altura (cm)"
                                type="number"
                                value={formData.altura || ''}
                                onChange={(e) => handleInputChange('altura', Number(e.target.value))}
                                fullWidth
                                disabled={dialogMode === 'view'}
                                inputProps={{ min: 0, max: 300 }}
                                sx={{
                                    background: (theme) => theme.palette.background.paper, fontFamily: "'Poppins', sans-serif",
                                    fontSize: { xs: "0.9rem", md: "1rem" },
                                }}
                            />
                            <TextField
                                label="Cuello-Manga (cm)"
                                type="number"
                                value={formData.cuelloManga || ''}
                                onChange={(e) => handleInputChange('cuelloManga', Number(e.target.value))}
                                fullWidth
                                disabled={dialogMode === 'view'}
                                inputProps={{ min: 0, max: 200 }}
                                sx={{
                                    background: (theme) => theme.palette.background.paper, fontFamily: "'Poppins', sans-serif",
                                    fontSize: { xs: "0.9rem", md: "1rem" },
                                }}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Pecho (cm)"
                                type="number"
                                value={formData.pecho || ''}
                                onChange={(e) => handleInputChange('pecho', Number(e.target.value))}
                                fullWidth
                                disabled={dialogMode === 'view'}
                                inputProps={{ min: 0, max: 200 }}
                                sx={{
                                    background: (theme) => theme.palette.background.paper, fontFamily: "'Poppins', sans-serif",
                                    fontSize: { xs: "0.9rem", md: "1rem" },
                                }}
                            />
                            <TextField
                                label="Cintura (cm)"
                                type="number"
                                value={formData.cintura || ''}
                                onChange={(e) => handleInputChange('cintura', Number(e.target.value))}
                                fullWidth
                                disabled={dialogMode === 'view'}
                                inputProps={{ min: 0, max: 200 }}
                                sx={{
                                    background: (theme) => theme.palette.background.paper, fontFamily: "'Poppins', sans-serif",
                                    fontSize: { xs: "0.9rem", md: "1rem" },
                                }}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Cadera (cm)"
                                type="number"
                                value={formData.cadera || ''}
                                onChange={(e) => handleInputChange('cadera', Number(e.target.value))}
                                fullWidth
                                disabled={dialogMode === 'view'}
                                inputProps={{ min: 0, max: 200 }}
                                sx={{
                                    background: (theme) => theme.palette.background.paper, fontFamily: "'Poppins', sans-serif",
                                    fontSize: { xs: "0.9rem", md: "1rem" },
                                }}
                            />
                            <TextField
                                label="Entrepierna (cm)"
                                type="number"
                                value={formData.entrepierna || ''}
                                onChange={(e) => handleInputChange('entrepierna', Number(e.target.value))}
                                fullWidth
                                disabled={dialogMode === 'view'}
                                inputProps={{ min: 0, max: 200 }}
                                sx={{
                                    background: (theme) => theme.palette.background.paper, fontFamily: "'Poppins', sans-serif",
                                    fontSize: { xs: "0.9rem", md: "1rem" },
                                }}
                            />
                        </Stack>
                    </Stack>
                </DialogContent>

                {dialogMode !== 'view' && (
                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button onClick={handleCloseDialog} color="inherit" sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: { xs: "0.9rem", md: "1rem" },
                        }}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={loading || !formData.nombre || !formData.email || (dialogMode === 'create' && !formData.password)}
                            startIcon={loading && <CircularProgress size={16} />}
                            sx={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: { xs: "0.9rem", md: "1rem" },
                            }}
                        >
                            {dialogMode === 'create' ? 'Crear' : 'Guardar'}
                        </Button>
                    </DialogActions>
                )}
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        width: '100%', fontFamily: "'Poppins', sans-serif",
                        fontSize: { xs: "0.9rem", md: "1rem" },
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};