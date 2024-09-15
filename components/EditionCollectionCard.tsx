import styles from "../styles/Home.module.css";
import {
  MediaRenderer,
  useActiveClaimConditionForWallet,
  useAddress,
  useContract,
  useContractMetadata,
} from "@thirdweb-dev/react";

type CollectionCardProps = {
  contractAddress: string;
};

const EditionCollectionCard = ({ contractAddress }: CollectionCardProps) => {
  const address = useAddress();

  const { contract } = useContract(contractAddress);

  const { data: contractMetadata, isLoading: isContractMetadataLoading } =
    useContractMetadata(contract);

  const { data: activeClaimPhase, isLoading: isActiveClaimPhaseLoading } =
    useActiveClaimConditionForWallet(contract, address);

  if (isContractMetadataLoading) return <></>;

  return (
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
  );
};

export default EditionCollectionCard;
