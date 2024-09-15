import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { collections } from "../const/addresses";
import CollectionCard from "../components/CollectionCard";
import EditionCollectionCard from "../components/EditionCollectionCard";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {collections.map((collection) => {
          const Card =
            collection.type === "nft" ? CollectionCard : EditionCollectionCard;
          return <Card contractAddress={collection.address} />;
        })}
      </main>
    </div>
  );
};

export default Home;
