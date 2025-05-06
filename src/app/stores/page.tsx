import { useEffect, useState } from "react";
import { getStores } from "../../api/storeApi";
import { Store as StoreType } from "../../types/store";
import { Stack, CircularProgress, Box } from "@mui/material";
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <CircularProgress />
            </Box>
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
