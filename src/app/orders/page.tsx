import { Layout } from "../../components/Layout";
import { Title } from "../../components/Title";
import { ListOrders } from "../orders/ListOrders";

export const Orders = () => {
  return (
    <Layout arrow path="/home">
      <Title text="MIS PEDIDOS" marginTop={30} paddingTop="0"></Title>
      <ListOrders />
    </Layout>
  );
};
