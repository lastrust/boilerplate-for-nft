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

export type UseBunzzReturns = ReturnType<typeof useBunzz>;

// This is a hook that wrap Bunzz SDK.
// Documentation of bunzz-sdk is here (https://docs.bunzz.dev/product-docs/sdk/guides).
export const useBunzz = () => {
  console.log('');
};
