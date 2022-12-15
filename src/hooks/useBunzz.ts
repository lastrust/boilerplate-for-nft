import bunzz, { Contract, Handler } from 'bunzz-sdk';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// ===== Make changes as needed (start) =====
export const chainId = 80001;
const MODULE_NAME = 'NFTMintingModule'; // This value is the name of module in Bunzz App.
export const NETWORK_INFO = {
  chainName: 'Mumbai Testnet',
  chainId: '0x' + chainId.toString(16),
  nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
  rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
};
const IPFS_GW_BASEURL_JSON = `https://cloudflare-ipfs.com/ipfs`;
// ===== Make changes as needed (end) ======

// You can get these values from "Client SDK" in sidebar of Bunzz App
const DAPP_ID = process.env.REACT_APP_DAPP_ID || '';
const API_KEY = process.env.REACT_APP_API_KEY || '';

export type Metadata = {
  name: string;
  imageURI: string;
};

export type UseBunzzReturns = ReturnType<typeof useBunzz>;

// This is a hook that wrap Bunzz SDK.
// Documentation of bunzz-sdk is here (https://docs.bunzz.dev/product-docs/sdk/guides).
export const useBunzz = () => {
  const [handler, setHandler] = useState<Handler>();
  const [contract, setContract] = useState<Contract>();
  const [readonlyContract, setReadonlyContract] = useState<Contract>();
  const [signerAddr, setSignerAddr] = useState('');

  const [isInitializing, setIsInitializing] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const [maxSupply, setMaxSupply] = useState(0);
  const [cost, setCost] = useState('');
  const [mintedNum, setMintedNum] = useState(0);
  const [metadataList, setMetadataList] = useState<Metadata[]>();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!readonlyContract) return;

    fetchInfo();
  }, [readonlyContract]);

  const init = async () => {
    try {
      setIsInitializing(true);

      // Initialize bunzz
      const handler = await bunzz.init({
        dappId: DAPP_ID,
        apiKey: API_KEY,
      });
      setReadonlyContract(handler.getReadonlyContract(MODULE_NAME));
      setHandler(handler);

      // If the user is connected to the wallet, set the required properties
      const signer = handler.getSigner();
      if (signer) {
        await setup(handler);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error has occurred');
    } finally {
      setIsInitializing(false);
    }
  };

  // Connect to the wallet
  const connect = async () => {
    if (!handler) return;

    try {
      // Reqest to connect to the wallet
      await handler.connectWallet();
      // If the user connects to the wallet, set the required properties
      await setup(handler);
    } catch (error) {
      console.error(error);
    }
  };

  // Set the contract, owned NFTs, signer address and network
  const setup = async (handler: Handler) => {
    const provider = handler.getProvider();
    const contract = handler.getContract(MODULE_NAME);
    const readonlyContract = handler.getReadonlyContract(MODULE_NAME);
    const network = await provider.getNetwork();
    const signer = await handler.getSignerAddress();
    await getOwnedNFTs(readonlyContract, signer);

    setContract(contract);
    setSignerAddr(signer);
  };

  // Mint NFTs by paying
  const mint = async (amount: number) => {
    if (!contract || !signerAddr || !readonlyContract) return;

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
      await fetchInfo();
      await getOwnedNFTs(contract, signerAddr);
    } catch (error) {
      console.error(error);
      toast.error('Mint failed');
    } finally {
      setIsMinting(false);
    }
  };

  // Fetch information related to NFT
  const fetchInfo = async () => {
    if (!readonlyContract) return;

    await getMaxSupply(readonlyContract);
    await getCost(readonlyContract);
    await getMintedNum(readonlyContract);
  };

  // Get max supply from contract
  const getMaxSupply = async (contract: Contract) => {
    const maxSupply = await contract.maxSupply();
    setMaxSupply(parseInt(maxSupply.data));
  };

  // Get cost from contract
  const getCost = async (contract: Contract) => {
    const res = await contract.publicCost();
    setCost((Number(res.data) / 10 ** 18).toString());
  };

  // Get number of minted from contract
  const getMintedNum = async (contract: Contract) => {
    const res = await contract.totalSupply();
    setMintedNum(parseInt(res.data));
  };

  // Get owned NFTs from contract and IPFS
  const getOwnedNFTs = async (contract: Contract, address: string) => {
    const tokenIds = await getTokenIds(contract, address);
    const metadataList = await getMetadata(contract, tokenIds);
    setMetadataList(metadataList);
  };

  // Get token ids from contract
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

  // Get metadata from IPFS
  const getMetadata = async (contract: Contract, tokenIds: number[]) => {
    const metadataURIs = await Promise.all(
      tokenIds.map(async (tokenId) => {
        const tokenURI = await contract.tokenURI(tokenId);
        const uriSuffix = getHashFromIpfsUri(tokenURI.data);
        return `${IPFS_GW_BASEURL_JSON}/${uriSuffix}`;
      })
    );

    const metadataList = await Promise.all(
      metadataURIs.map(async (uri) => {
        const res = await fetch(uri, {
          method: 'GET',
        });
        const body = await res.json();
        const imageURISuffix = getHashFromIpfsUri(body.image);
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
    cost,
    maxSupply,
    mintedNum,
    metadataList,
    mint,
    connect,
  };
};

const getHashFromIpfsUri = (uri: string): string => {
  return uri.split('//')[1];
};
