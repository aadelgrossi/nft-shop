import {
  MediaRenderer,
  useActiveClaimCondition,
  useContract,
} from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";

type EditionItemProps = {
  nft: NFT;
  contractAddress: string;
};

const EditionItem = ({ nft, contractAddress }: EditionItemProps) => {
  const { contract } = useContract(contractAddress);

  const { data: activeClaimCondition, isLoading } = useActiveClaimCondition(
    contract,
    nft.metadata.id
  );

  console.log({ activeClaimCondition });

  return (
    <div>
      <MediaRenderer src={nft.metadata.image} style={{ borderRadius: 10 }} />

      {isLoading ? (
        <p>Loading</p>
      ) : (
        <>
          <h3 style={{ margin: "unset" }}>{nft.metadata.name}</h3>
          <p>
            Price: {activeClaimCondition?.currencyMetadata.displayValue}{" "}
            {activeClaimCondition?.currencyMetadata.symbol}
          </p>
          <p>Max Limit: {activeClaimCondition?.maxClaimablePerWallet}</p>
          <p>
            Supply: {activeClaimCondition?.availableSupply} /{" "}
            {activeClaimCondition?.maxClaimableSupply}
          </p>
        </>
      )}
    </div>
  );
};

export default EditionItem;
