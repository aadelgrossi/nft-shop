import styles from "../styles/Home.module.css";
import {
  MediaRenderer,
  useContract,
  useContractMetadata,
  useNFTs,
} from "@thirdweb-dev/react";
import EditionItem from "./EditionItem";

type CollectionCardProps = {
  contractAddress: string;
};

const EditionCollectionCard = ({ contractAddress }: CollectionCardProps) => {
  const { contract } = useContract(contractAddress);

  const { data: contractMetadata, isLoading: isContractMetadataLoading } =
    useContractMetadata(contract);

  const { data: nfts } = useNFTs(contract);

  if (isContractMetadataLoading) return <></>;

  return (
    <div style={{ backgroundColor: "#1b2129", padding: "2rem" }}>
      <div className={styles.heroSection}>
        <div className={styles.collectionImage}>
          <MediaRenderer
            src={contractMetadata?.image}
            width="100%"
            height="100%"
          />
        </div>
        <div>
          <h1 style={{ margin: "unset" }}>{contractMetadata?.name}</h1>
          <p>{contractMetadata?.description}</p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gridGap: "1rem",
        }}
      >
        {nfts?.map((nft) => (
          <EditionItem contractAddress={contractAddress} nft={nft} />
        ))}
      </div>
    </div>
  );
};

export default EditionCollectionCard;
