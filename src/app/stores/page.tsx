import { useEffect, useState } from "react";
import { getStores } from "../../api/storeApi";
import { Store as StoreType } from "../../types/store";
import {
  Stack,
  Box,
  Skeleton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { StoreCard } from "./StoreCard";
import { Title } from "../../components/Title";
import { Layout } from "../../components/Layout";
import { Details } from "../../components/Details";
import ErrorModal from "../../components/ErrorModal";

export const Stores = () => {
  const theme = useTheme();
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getStores();
        setStores(data);
        setError(null);
      } catch (err) {
        setError(
          "Error al cargar las tiendas. Por favor, inténtalo de nuevo más tarde: " +
          err
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  if (error) {
    return <ErrorModal error={error} />;
  }

  const StoreSkeleton = () => (
    <StoreCard path="#">
      <Box>
        <Box sx={{ marginTop: 2, paddingTop: "20px" }}>
          <Skeleton
            variant="text"
            height={40}
            width="70%"
            sx={{
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
              fontSize: "1.8rem",
            }}
          />
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Skeleton
            variant="text"
            height={24}
            width="90%"
            sx={{
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
              marginBottom: 1,
            }}
          />
          <Skeleton
            variant="text"
            height={24}
            width="75%"
            sx={{
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
            }}
          />
        </Box>
      </Box>
    </StoreCard>
  );

  const filteredStores = stores.filter((store) =>
    store.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Title
        text="TIENDAS EN VUMMY"
        marginTop={stores.length > 2 ? 120 : 50}
        paddingTop="0px"
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          paddingX: 2,
        }}
      >
        <TextField
          placeholder="Buscar tienda..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            maxWidth: "90%",
            mt: 2,
            mb: 2.5,
            fontFamily: "'Poppins', sans-serif",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#f5f5f5"
                : theme.palette.background.paper,
            borderRadius: "20px",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              border: "none",
            },
            boxShadow:
              theme.palette.background.paper
          }}
        />
      </Box>

      <Stack
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "15px",
          width: "100%",
        }}
      >
        {loading ? (
          <>
            <StoreSkeleton />
            <StoreSkeleton />
            <StoreSkeleton />
          </>
        ) : filteredStores.length === 0 ? (
          <Typography variant="h6" sx={{ marginTop: 2, fontFamily: "'Poppins', sans-serif", }}>
            No se encontraron tiendas.
          </Typography>
        ) : (
          filteredStores
            .sort((a, b) => a.id! - b.id!)
            .map((store) => (
              <StoreCard key={store.id} path={`/stores/${store.id}/clothes`}>
                <>
                  <Title text={store.nombre} marginTop={2} paddingTop="20px" />
                  <Details detail={store.descripcion} />
                </>
              </StoreCard>
            ))
        )}
      </Stack>
    </Layout>
  );
};
