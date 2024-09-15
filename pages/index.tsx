import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { CONTRACT_ADDRESS } from "../const/addresses";
import CollectionCard from "../components/CollectionCard";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <CollectionCard contractAddress={CONTRACT_ADDRESS} />
      </main>
    </div>
  );
};

export default Home;
