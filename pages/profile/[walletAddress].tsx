import {
  NFT,
  ThirdwebNftMedia,
  useAddress,
  useContract,
} from "@thirdweb-dev/react";
import styles from "../../styles/Home.module.css";
import { CONTRACT_ADDRESS } from "../../const/addresses";
import useSWR from "swr";
import axios from "axios";

export default function Profile() {
  const address = useAddress();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const { data: ownedNFTs, isLoading: isOwnedNFTsLoading } = useSWR(
    ["/api/inventory", address],
    async (args) => {
      const [_, address] = args;
      const response = await axios.get<NFT[] | undefined>("/api/inventory", {
        params: { address },
      });
      return response.data;
    }
  );

  if (!address) {
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <p>Connect your wallet to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div>
        <div>
          <h1>Profile</h1>
          <p>Address: {truncateAddress(address || "")}</p>
        </div>
        <hr />
        <div>
          <h3>My NFTs:</h3>
          <div className={styles.grid}>
            {!isOwnedNFTsLoading ? (
              ownedNFTs?.length! > 0 ? (
                ownedNFTs?.map((nft) => (
                  <div key={nft.metadata.id} className={styles.NFTCard}>
                    <ThirdwebNftMedia
                      metadata={nft.metadata}
                      style={{ borderRadius: 20 }}
                    />
                    <h3>{nft.metadata.name}</h3>
                    <p style={{ margin: "unset" }}>{nft.type}</p>
                    <p style={{ margin: "unset" }}>
                      Owned: {nft?.quantityOwned || 1}
                    </p>
                  </div>
                ))
              ) : (
                <p>No NFTs owned.</p>
              )
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
