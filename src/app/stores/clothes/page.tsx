import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clothe } from "../../../types/clothe";
import { CircularProgress, Box, Typography } from "@mui/material";
import { Title } from "../../../components/Title";
import { Layout } from "../../../components/Layout";
import { getClotheByStoreId } from "../../../api/clotheApi";
import { getStoreById } from "../../../api/storeApi";
import { ClotheCard } from "./ClotheCard";

export const Clothes = () => {
  const { storeId } = useParams();
  const [clothes, setClothes] = useState<Clothe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [storeName, setStoreName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = Number(storeId);
        if (isNaN(id)) throw new Error("El storeId no es válido");

        const [clothesData, storeData] = await Promise.all([
          getClotheByStoreId(id),
          getStoreById(id),
        ]);

        setClothes(clothesData);
        if (storeData) {
          setStoreName(storeData.nombre);
        } else {
          console.warn("La tienda no existe.");
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchData();
    }
  }, [storeId]);

  return (
    <>
      <Layout arrow>
        {!loading && storeName && (
          <Title
            text={storeName.toUpperCase()}
            marginTop={clothes.length > 2 ? 30 : 10}
            paddingTop="0px"
          />
        )}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "flex-start",
            width: "100%",
            padding: "15px",
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
          ) : clothes.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                mt: 4,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No hay prendas disponibles.
              </Typography>
            </Box>
          ) : (
            clothes
              .filter((clothe) => typeof clothe.id === "number")
              .map((clothe) => (
                <ClotheCard
                  key={clothe.id}
                  id={clothe.id as number}
                  path={`/clothes/${clothe.id}`}
                  nombre={clothe.nombre}
                  precio={clothe.precio}
                  imagen={clothe.imagen ?? ""}
                />
              ))
          )}
        </Box>
      </Layout>
    </>
  );
};
