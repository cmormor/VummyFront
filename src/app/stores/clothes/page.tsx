import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clothe } from "../../../types/clothe";
import { Box, Typography, Skeleton, Card, CardContent } from "@mui/material";
import { Title } from "../../../components/Title";
import { Layout } from "../../../components/Layout";
import { getClotheByStoreId } from "../../../api/clotheApi";
import { getStoreById } from "../../../api/storeApi";
import { ClotheCard } from "./ClotheCard";
import { getRol } from "../../../api/userApi";

export const Clothes = () => {
  const { storeId } = useParams();
  const [clothes, setClothes] = useState<Clothe[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("");
  const [rol, setRol] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = Number(storeId);
        if (isNaN(id)) throw new Error("El storeId no es válido");

        // Traemos datos de ropa, tienda y rol de usuario en paralelo
        const [clothesData, storeData, rolUsuario] = await Promise.all([
          getClotheByStoreId(id),
          getStoreById(id),
          getRol(),
        ]);

        setClothes(clothesData);
        setStoreName(storeData?.nombre || "");
        setRol(rolUsuario);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) fetchData();
  }, [storeId]);

  const ClotheSkeleton = () => (
    <Box
      sx={{
        width: { xs: "100%", sm: "48%", md: "23%" },
        minWidth: "200px",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          borderColor: "#1976d2",
          borderWidth: 2,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.05)",
          boxShadow: "none",
          borderRadius: 2,
          marginTop: 2,
          marginBottom: 3,
          overflow: "hidden",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            width: "100%",
            height: 200,
            borderRadius: "8px 8px 0 0",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
          }}
        />
        <CardContent>
          <Skeleton
            variant="text"
            height={24}
            width="80%"
            sx={{
              mb: 1, backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
            }}
          />
          <Skeleton
            variant="text"
            height={24}
            width="40%"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Layout arrow>
      {loading ? (
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Skeleton
            variant="text"
            height={50}
            width="60%"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
              margin: "0 auto",
              fontSize: "2rem",
            }}
          />
        </Box>
      ) : (
        storeName && (
          <Title
            text={storeName.toUpperCase()}
            marginTop={clothes.length > 2 ? 30 : 10}
            paddingTop="0px"
          />
        )
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
          Array.from({ length: 6 }).map((_, i) => <ClotheSkeleton key={i} />)
        ) : clothes.length === 0 ? (
          <Box
            sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 4 }}
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
                rol={rol || ""}
              />
            ))
        )}
      </Box>
    </Layout>
  );
};
