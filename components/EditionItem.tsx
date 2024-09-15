import {
  MediaRenderer,
  useActiveClaimCondition,
  useAddress,
  useClaimIneligibilityReasons,
  useContract,
  Web3Button,
} from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";

type EditionItemProps = {
  nft: NFT;
  contractAddress: string;
};

const EditionItem = ({ nft, contractAddress }: EditionItemProps) => {
  const address = useAddress() || "";
  const router = useRouter();
  const { contract } = useContract(contractAddress);

  const { data: activeClaimCondition, isLoading } = useActiveClaimCondition(
    contract,
    nft.metadata.id
  );

  const { data: claimIneligibilityReasons = [] } = useClaimIneligibilityReasons(
    contract,
    { walletAddress: address, quantity: 1 },
    nft.metadata.id
  );

  const isIneligibleToClaim = claimIneligibilityReasons.length > 0;

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
          {address ? (
            <Web3Button
              isDisabled={isIneligibleToClaim}
              contractAddress={contractAddress}
              action={(contract) =>
                contract.erc1155.claimTo(address, nft.metadata.id, 1)
              }
              onSuccess={() => router.push(`/profile/${address}`)}
            >
              Claim NFT
            </Web3Button>
          ) : (
            <p>Connect wallet</p>
          )}
        </>
      )}
    </div>
  );
};

export default EditionItem;
