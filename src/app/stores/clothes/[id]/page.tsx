import { Box } from "@mui/material";
import ProductDetails from "./ProductDetails";
import ProductViewer from "./ProductViewer";
import { Layout } from "../../../../components/Layout";

export const Clothe = () => {
  return (
    <Layout arrow>
      <Box
        display="flex"
        gap={3}
        flexDirection={{ xs: "column", md: "row" }}
        alignItems="flex-start"
        justifyContent="center"
        p={2}
        mt={5}
      >
        <Box flex={1}>
          <ProductViewer />
        </Box>
        <Box flex={1}>
          <ProductDetails />
        </Box>
      </Box>
    </Layout>
  );
};
