import bunzz, { Contract } from "bunzz-sdk";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import NFTAbi from "assets/abis/nft.json";
import { toast } from "react-toastify";

export const chainId = 80001;
const DAPP_ID = process.env.REACT_APP_DAPP_ID || "";
const API_KEY = process.env.REACT_APP_API_KEY || "";
const IPFS_GW_BASEURL_JSON = `https://cloudflare-ipfs.com/ipfs`;
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || "";
const MODULE_NAME = "NFTMintingModule";
const NETWORK_INFO = {
  chainName: "Mumbai Testnet",
  chainId: "0x" + chainId.toString(16),
  nativeCurrency: { name: "MATIC", decimals: 18, symbol: "MATIC" },
  rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
};

const readProvider = new ethers.providers.JsonRpcProvider(
  NETWORK_INFO.rpcUrls[0]
);

export type Metadata = {
  name: string;
  imageURI: string;
};

export type UseBunzzReturns = ReturnType<typeof useBunzz>;

export const useBunzz = () => {
  const [contract, setContract] = useState<Contract>();
  const [signerAddr, setSignerAddr] = useState("");

  const [isInitializing, setIsInitializing] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isCorrectChain, setIsCorrectChain] = useState(false);

  const [maxSupply, setMaxSupply] = useState(0);
  const [cost, setCost] = useState("");
  const [mintedNum, setMintedNum] = useState(0);
  const [metadataList, setMetadataList] = useState<Metadata[]>();

  useEffect(() => {
    init();
    fetchInfo();
  }, []);

  const init = async () => {
    try {
      setIsInitializing(true);
      const handler = await bunzz.initializeHandler({
        dappId: DAPP_ID,
        apiKey: API_KEY,
      });
      const contract = handler.getContract(MODULE_NAME);
      const signer = await handler.getSignerAddress();
      const provider = handler.getProvider();
      const network = await provider.getNetwork();

      setIsCorrectChain(network.chainId === chainId);
      setContract(contract);
      setSignerAddr(signer);

      await getOwnedNFTs(contract, signer);
    } catch (error) {
      console.error(error);
      toast.error("An error has occurred");
    } finally {
      setIsInitializing(false);
    }
  };

  const switchChain = async () => {
    try {
      setIsSwitching(true);
      await window.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + chainId.toString(16) }],
      });
    } catch (error) {
      console.log(error);
      if ((error as any).code === 4902) {
        await window.ethereum?.request({
          method: "wallet_addEthereumChain",
          params: [NETWORK_INFO],
        });
      }
    } finally {
      setIsSwitching(false);
    }
  };

  const mint = async (amount: number) => {
    if (!contract || !signerAddr) return;

    try {
      setIsMinting(true);
      const tx = await contract.publicMint(amount, {
        value: ethers.utils.parseEther((Number(cost) * amount).toString()),
      });
      console.log(tx);
      const receipt = await tx.wait();
      console.log(receipt);
      toast("NFT minted");

      await fetchInfo();
      await getOwnedNFTs(contract, signerAddr);
    } catch (error) {
      console.error(error);
      toast.error("Mint failed");
    } finally {
      setIsMinting(false);
    }
  };

  const fetchInfo = async () => {
    const contract = getContract();
    await getMaxSupply(contract);
    await getCost(contract);
    await getMintedNum(contract);
  };

  const getContract = () => {
    return new ethers.Contract(CONTRACT_ADDRESS, NFTAbi, readProvider);
  };

  const getMaxSupply = async (readContract: ethers.Contract) => {
    const maxSupply = await readContract.maxSupply();
    setMaxSupply(parseInt(maxSupply._hex, 16));
  };

  const getCost = async (readContract: ethers.Contract) => {
    const res = await readContract.publicCost();
    setCost(ethers.utils.formatEther(res));
  };

  const getMintedNum = async (readContract: ethers.Contract) => {
    const res = await readContract.totalSupply();
    setMintedNum(parseInt(res, 16));
  };

  const getOwnedNFTs = async (contract: Contract, address: string) => {
    const tokenIds = await getTokenIds(contract, address);
    const metadataList = await getMetadata(contract, tokenIds);
    setMetadataList(metadataList);
  };

  const getTokenIds = async (contract: Contract, address: string) => {
    const balanceRes = await contract.balanceOf(address);
    const balance = balanceRes.data;
    let tokenIds: number[] = [];
    for (let i = 0; i < balance; i++) {
      const res = await contract.tokenOfOwnerByIndex(address, i);
      tokenIds.push(Number(res.data));
    }
    return tokenIds;
  };

  const getMetadata = async (contract: Contract, tokenIds: number[]) => {
    const metadataURIs = await Promise.all(
      tokenIds.map(async (tokenId) => {
        const tokenURI = await contract.tokenURI(tokenId);
        const uriSuffix = tokenURI.data.split("//")[1];
        return `${IPFS_GW_BASEURL_JSON}/${uriSuffix}`;
      })
    );

    const metadataList = await Promise.all(
      metadataURIs.map(async (uri) => {
        const res = await fetch(uri, {
          method: "GET",
        });
        const body = await res.json();
        const imageURISuffix = body.image.split("//")[1];
        const imageURI = `${IPFS_GW_BASEURL_JSON}/${imageURISuffix}`;
        const metadata: Metadata = {
          imageURI,
          name: body.name,
        };
        return metadata;
      })
    );
    return metadataList;
  };

  return {
    signerAddr,
    isInitializing,
    isMinting,
    isSwitching,
    isCorrectChain,
    cost,
    maxSupply,
    mintedNum,
    metadataList,
    init,
    mint,
    switchChain,
  };
};
