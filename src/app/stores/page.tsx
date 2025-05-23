import { useEffect, useState } from "react";
import { getStores } from "../../api/storeApi";
import { Store as StoreType } from "../../types/store";
import { Stack, Box, Skeleton } from "@mui/material";
import { StoreCard } from "./StoreCard";
import { Title } from "../../components/Title";
import { Layout } from "../../components/Layout";
import { Details } from "../../components/Details";

export const Stores = () => {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStores = async () => {
      const data = await getStores();
      setStores(data);
      setLoading(false);
    };
    fetchStores();
  }, []);

  const StoreSkeleton = () => (
    <StoreCard path="#">
      <Box>
        <Box sx={{ marginTop: 2, paddingTop: '20px' }}>
          <Skeleton
            variant="text"
            height={40}
            width="70%"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
              fontSize: '1.8rem'
            }}
          />
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Skeleton
            variant="text"
            height={24}
            width="90%"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
              marginBottom: 1
            }}
          />
          <Skeleton
            variant="text"
            height={24}
            width="75%"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
            }}
          />
        </Box>
      </Box>
    </StoreCard>
  );

  return (
    <>
      <Layout>
        <Title
          text="TIENDAS DISPONIBLES EN VUMMY"
          marginTop={stores.length > 2 ? 120 : 50}
          paddingTop="0px"
        />
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
          ) : (
            stores.map((store) => (
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
    </>
  );
};