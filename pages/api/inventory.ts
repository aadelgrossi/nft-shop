import { ArbitrumSepolia, Chain } from "@thirdweb-dev/chains";
import { getErcs, ThirdwebSDK } from "@thirdweb-dev/react";
import { NextApiHandler } from "next";
import { collections } from "../../const/addresses";

const handler: NextApiHandler = async (req, res) => {
  const ownerAddress = req.query.address as string;
  const chain = (req.query.chain as any as Chain) || ArbitrumSepolia;
  const params = req.query.params as any as Record<string, string>;

  const sdk = new ThirdwebSDK(chain);

  const promises = collections.map(async (collection) => {
    try {
      const contract = await sdk.getContract(collection.address);
      const { erc1155, erc721 } = getErcs(contract);

      if (erc721) {
        return await erc721.getOwned(ownerAddress, params);
      }

      if (erc1155) {
        return await erc1155.getOwned(ownerAddress, params);
      }
    } catch {
      return res.status(404).json({
        error: `No data for contract ${collection.address} on ${chain}`,
      });
    }
  });

  const ownedNfts = await Promise.all(promises);

  return res.json(ownedNfts.flat());
};

export default handler;
