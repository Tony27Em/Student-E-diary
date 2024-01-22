import { NextPage } from "next";
import Layout from "@/components/layout/layout";
import Homepage from "@/components/homepage/homepage";

const Home: NextPage = () => {
  return (
    <Layout>
      <Homepage />
    </Layout>
  )
}

export default Home;
