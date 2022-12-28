import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import abi from '../assets/abis/nft.json';

const IPFS_GW_BASEURL_JSON = `https://cloudflare-ipfs.com/ipfs`;

const getHashFromIpfsUri = (uri: string): string => {
  return uri.split('//')[1];
};

export type Metadata = {
  name: string;
  imageURI: string;
};

export type UseContractReturns = ReturnType<typeof useContract>;

export const useContract = (
  address: string,
  library: Web3Provider | undefined,
  active: boolean
) => {
  const [contract, setContract] = useState<Contract>(
    new Contract(address, abi, library?.getSigner())
  );
  const [maxSupply, setMaxSupply] = useState(0);
  const [cost, setCost] = useState('');
  const [mintedNum, setMintedNum] = useState(0);
  const [metadataList, setMetadataList] = useState<Metadata[]>();
  const [isMinting, setIsMinting] = useState(false);

  // Get token ids from contracts
  const getTokenIds = async (contract: Contract, address: string) => {
    const balanceRes = await contract.balanceOf(address);
    const balance = balanceRes.data;
    const tokenIds: number[] = [];

    for (let i = 0; i < balance; i++) {
      const res = await contract.tokenOfOwnerByIndex(address, i);
      tokenIds.push(Number(res.data));
    }

    return tokenIds;
  };

  useEffect(() => {
    if (active) {
      const con = new Contract(address, abi, library?.getSigner());
      setContract(con);
      fetchInfo(con);
    }
  }, [active]);

  // Get metadata from IPFS
  const getMetadata = async (contract: Contract, tokenIds: number[]) => {
    const metadataURIs = await Promise.all(
      tokenIds.map(async (tokenId) => {
        const tokenURI = await contract.tokenURI(tokenId);
        const uriSuffix = getHashFromIpfsUri(tokenURI.data);
        return `${IPFS_GW_BASEURL_JSON}/${uriSuffix}`;
      })
    );

    return await Promise.all(
      metadataURIs.map(async (uri) => {
        const res = await fetch(uri, {
          method: 'GET',
        });
        const body = await res.json();

        const imageURISuffix = getHashFromIpfsUri(body.image);
        return {
          imageURI: `${IPFS_GW_BASEURL_JSON}/${imageURISuffix}`,
          name: body.name,
        };
      })
    );
  };

  // Fetch information related to NFT
  const fetchInfo = async (contract: Contract) => {
    await getMaxSupply(contract);
    await getCost(contract);
    await getMintedNum(contract);
  };

  // Get max supply from contract
  const getMaxSupply = async (contract: Contract) => {
    const maxSupply = await contract.maxSupply();

    setMaxSupply(parseInt(maxSupply._hex));
  };

  // Get cost from contract
  const getCost = async (contract: Contract) => {
    const res = await contract.publicCost();
    setCost((Number(res._hex) / 10 ** 18).toString());
  };

  // Get number of minted from contract
  const getMintedNum = async (contract: Contract) => {
    const res = await contract.totalSupply();
    setMintedNum(parseInt(res._hex));
  };

  // Get owned NFTs from contract and IPFS
  const getOwnedNFTs = async (contract: Contract, address: string) => {
    const tokenIds = await getTokenIds(contract, address);
    const metadataList = await getMetadata(contract, tokenIds);

    setMetadataList(metadataList);
  };
  // Mint NFTs by paying
  const mint = async (
    contract: Contract,
    amount: number,
    signerAddr: string
  ) => {
    if (!contract || !signerAddr) return;

    try {
      setIsMinting(true);

      // Mint
      const tx = await contract.publicMint(amount, {
        value: (Number(cost) * amount * 10 ** 18).toString(),
      });
      console.log(tx);
      const receipt = await tx.wait();
      console.log(receipt);
      toast('NFT minted');

      // Refetch data to update UI
      await fetchInfo(contract);
      await getOwnedNFTs(contract, signerAddr);
    } catch (error) {
      console.error(error);
      toast.error('Mint failed');
    } finally {
      setIsMinting(false);
    }
  };

  return {
    contract,
    metadataList,
    isMinting,
    cost,
    maxSupply,
    mintedNum,
    mint,
    getTokenIds,
    getMetadata,
    getOwnedNFTs,
  };
};
