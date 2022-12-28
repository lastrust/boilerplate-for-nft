import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

const CHAINS = [1, 3, 4, 5, 42, 80001];

export const useConnectWallet = () => {
  const injectedConnector = new InjectedConnector({
    supportedChainIds: CHAINS,
  });
  const { chainId, account, activate, active, library } =
    useWeb3React<Web3Provider>();

  const connectHandler = async () => {
    try {
      await activate(injectedConnector);
    } catch (e) {
      console.log(e);
    }
  };

  return {
    chainId,
    account,
    activate,
    active,
    library,
    connectHandler,
  };
};
