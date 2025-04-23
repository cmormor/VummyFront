import { useEffect, useState } from "react";
import { getStores } from "../../api/storeApi";
import { Store as StoreType } from "../../types/store";
import { Stack, CircularProgress, Box } from "@mui/material";
import { NavBar } from "../../components/NavBar";
import { StoreCard } from "../../components/StoreCard";
import { Title } from "../../components/Title";
import { Layout } from "../../components/Layout";
import { Description } from "../../components/Description";

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
      <NavBar />
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
              <StoreCard key={store.id} path="/stores/mantenimiento">
                <>
                  <Title text={store.nombre} marginTop={2} paddingTop="20px" />
                  <Description text={store.descripcion} />
                </>
              </StoreCard>
            ))
          )}
        </Stack>
      </Layout>
    </>
  );
};
