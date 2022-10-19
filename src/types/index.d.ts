// see https://docs.metamask.io/guide/
interface Window {
  ethereum?: {
    request: MetamaskRequest;
    on: MetamaskEventHandler;
    removeListener: MetamaskEventHandler;
    removeAllListeners: (event: MetamaskEvent) => void;
    isMetaMask: boolean;
    isConnected: () => boolean;
  };
}
