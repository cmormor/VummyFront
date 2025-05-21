import { Layout } from "../../components/Layout";
import { Title } from "../../components/Title";
import { ShoppingCartList } from "./ShoppingCartList";

export const ShoppingCart = () => {
  return (
    <Layout arrow path="/home">
      <Title text="TU CARRITO" marginTop={0} paddingTop="0" />
      <ShoppingCartList />
    </Layout>
  );
};
