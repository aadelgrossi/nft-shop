import styles from "../styles/Home.module.css";
import {
  MediaRenderer,
  Web3Button,
  useActiveClaimConditionForWallet,
  useAddress,
  useClaimIneligibilityReasons,
  useContract,
  useContractMetadata,
  useTotalCirculatingSupply,
  useTotalCount,
} from "@thirdweb-dev/react";
import { CONTRACT_ADDRESS } from "../const/addresses";
import { useRouter } from "next/router";
import { useState } from "react";

type CollectionCardProps = {
  contractAddress: string;
};

const CollectionCard = ({ contractAddress }: CollectionCardProps) => {
  const address = useAddress();
  const router = useRouter();
  const maxClaimQuantity = 2;

  const { contract } = useContract(contractAddress);

  const { data: contractMetadata, isLoading: isContractMetadataLoading } =
    useContractMetadata(contract);

  const { data: activeClaimPhase, isLoading: isActiveClaimPhaseLoading } =
    useActiveClaimConditionForWallet(contract, address);

  const {
    data: claimIneligibilityReasons,
    isLoading: isClaimIneligibilityReasonsLoading,
  } = useClaimIneligibilityReasons(contract, {
    walletAddress: address || "",
    quantity: 1,
  });

  const { data: totalSupply, isLoading: isTotalSupplyLoading } =
    useTotalCount(contract);
  const { data: totalClaimSupply, isLoading: isTotalClaimSupplyLoading } =
    useTotalCirculatingSupply(contract);

  const [claimQuantity, setClaimQuantity] = useState(1);
  const increment = () => {
    if (claimQuantity < maxClaimQuantity) {
      setClaimQuantity((value) => value + 1);
    }
  };
  const decrement = () => {
    if (claimQuantity > 1) {
      setClaimQuantity((value) => value - 1);
    }
  };

  if (isContractMetadataLoading) return <></>;

  return (
    <div className={styles.heroSection} style={{ padding: "2rem" }}>
      <div className={styles.collectionImage}>
        <MediaRenderer src={contractMetadata?.image} />
      </div>
      <div>
        <h1 style={{ margin: "unset" }}>{contractMetadata?.name}</h1>
        <p>{contractMetadata?.description}</p>
        {!isActiveClaimPhaseLoading ? (
          <div>
            <p>Claim Phase: {activeClaimPhase?.metadata?.name}</p>
            <p>
              Price: {activeClaimPhase?.currencyMetadata.displayValue}{" "}
              {activeClaimPhase?.currencyMetadata.symbol}
            </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        {!isTotalSupplyLoading && !isTotalClaimSupplyLoading ? (
          <p>
            Claimed: {totalClaimSupply?.toNumber()} / {totalSupply?.toNumber()}
          </p>
        ) : (
          <p>Loading...</p>
        )}
        {address ? (
          !isClaimIneligibilityReasonsLoading ? (
            claimIneligibilityReasons?.length! > 0 ? (
              claimIneligibilityReasons?.map((reason, index) => (
                <p key={index}>{reason}</p>
              ))
            ) : (
              <div>
                <p>Eligible to claim</p>
                <div className={styles.claimContainer}>
                  <div className={styles.claimValue}>
                    <button className={styles.claimBtn} onClick={decrement}>
                      -
                    </button>
                    <input
                      className={styles.claimInput}
                      type="number"
                      value={claimQuantity}
                    />
                    <button className={styles.claimBtn} onClick={increment}>
                      +
                    </button>
                  </div>
                  <Web3Button
                    contractAddress={CONTRACT_ADDRESS}
                    action={(contract) => contract.erc721.claim(claimQuantity)}
                    onSuccess={() => router.push(`/profile/${address}`)}
                  >
                    Claim NFT
                  </Web3Button>
                </div>
              </div>
            )
          ) : (
            <p>Checking Eligibility...</p>
          )
        ) : (
          <p>Connect Wallet to claim</p>
        )}
      </div>
    </div>
  );
};

export default CollectionCard;
