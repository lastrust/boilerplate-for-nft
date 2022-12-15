import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import React, { useEffect } from 'react';
import { Button } from '../Button/Button';

const CHAINS = [1, 3, 4, 5, 42];

export const ConnectWallet: React.FC = () => {
  const { chainId, account, activate, active, library } =
    useWeb3React<Web3Provider>();

  const injectedConnector = new InjectedConnector({
    supportedChainIds: CHAINS,
  });

  const onClick = () => {
    activate(injectedConnector);
  };

  useEffect(() => {
    console.log(chainId, account, active);
  });

  return (
    <div className="connect-btn">
      <div className="body-2">Connect to Ethereum Mainenet</div>
      <Button variant="outline" onClick={onClick}>
        Connect
      </Button>
    </div>
  );
};
