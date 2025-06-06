import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Skeleton,
  Card,
  CardContent,
  Fade,
  Container,
} from "@mui/material";
import { Clothe } from "../../../types/clothe";
import { Title } from "../../../components/Title";
import { Layout } from "../../../components/Layout";
import { getClotheByStoreId } from "../../../api/clotheApi";
import { getStoreById } from "../../../api/storeApi";
import { ClotheCard } from "./ClotheCard";
import { getRol } from "../../../api/userApi";
import ErrorModal from "../../../components/ErrorModal";

export const Clothes = () => {
  const { storeId } = useParams();
  const [clothes, setClothes] = useState<Clothe[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("");
  const [rol, setRol] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = Number(storeId);
        if (isNaN(id)) throw new Error("El ID de la tienda no es válido");

        const [clothesData, storeData, rolUsuario] = await Promise.all([
          getClotheByStoreId(id),
          getStoreById(id),
          getRol(),
        ]);

        setClothes(clothesData);
        setStoreName(storeData?.nombre || "");
        setRol(rolUsuario);
        setError(null);
      } catch (error) {
        setError(
          "Error al cargar las prendas. Por favor, inténtalo de nuevo más tarde."
        );
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) fetchData();
  }, [storeId]);

  const ClotheSkeleton = () => (
    <Card
      variant="outlined"
      sx={{
        width: { xs: "100%", sm: "280px", md: "300px" },
        height: "400px",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 4px 20px rgba(255, 255, 255, 0.05)"
            : "0 4px 20px rgba(0, 0, 0, 0.08)",
        border: (theme) =>
          `1px solid ${
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.08)"
          }`,
      }}
    >
      <Skeleton
        variant="rectangular"
        sx={{
          width: "100%",
          height: "280px",
          animation: "wave",
        }}
      />
      <CardContent sx={{ p: 2 }}>
        <Skeleton
          variant="text"
          height={28}
          width="80%"
          sx={{ mb: 1, borderRadius: 1 }}
        />
        <Skeleton
          variant="text"
          height={24}
          width="50%"
          sx={{ borderRadius: 1 }}
        />
      </CardContent>
    </Card>
  );

  const EmptyState = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "300px",
        textAlign: "center",
        py: 6,
      }}
    >
      <Typography
        variant="h5"
        color="text.secondary"
        sx={{
          mb: 2,
          fontWeight: 300,
          opacity: 0.8,
        }}
      >
        No hay prendas disponibles
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.6 }}>
        Esta tienda aún no tiene productos en su catálogo
      </Typography>
    </Box>
  );

  if (error) {
    return <ErrorModal error={error} />;
  }

  return (
    <Layout arrow>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ mb: 4, mt: 2 }}>
          {loading ? (
            <Skeleton
              variant="text"
              height={60}
              width="60%"
              sx={{
                fontSize: "2.5rem",
                mx: "auto",
                borderRadius: 2,
              }}
            />
          ) : (
            storeName && (
              <Fade in={!loading} timeout={800}>
                <Box>
                  <Title
                    text={storeName.toUpperCase()}
                    marginTop={0}
                    paddingTop="0px"
                  />
                </Box>
              </Fade>
            )
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 2, sm: 3, md: 4 },
            justifyContent: { xs: "center", sm: "center" },
            width: "100%",
            minHeight: loading ? "400px" : "auto",
          }}
        >
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <ClotheSkeleton key={`skeleton-${index}`} />
            ))
          ) : clothes.length === 0 ? (
            <Box sx={{ width: "100%" }}>
              <EmptyState />
            </Box>
          ) : (
            clothes
              .filter((clothe) => typeof clothe.id === "number")
              .map((clothe, index) => (
                <Fade
                  in={!loading}
                  timeout={600}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  key={clothe.id}
                >
                  <Box mt={5}>
                    <ClotheCard
                      id={clothe.id as number}
                      path={`/clothes/${clothe.id}`}
                      nombre={clothe.nombre}
                      precio={clothe.precio}
                      imagen={clothe.imagen ?? ""}
                      rol={rol || ""}
                    />
                  </Box>
                </Fade>
              ))
          )}
        </Box>
      </Container>
    </Layout>
  );
};
