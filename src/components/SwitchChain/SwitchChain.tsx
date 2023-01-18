import { FC, useState } from 'react';
import { chainId, NETWORK_INFO } from '../../const/networkInfo';
import { Button } from '../Button/Button';

export const SwitchChain: FC = () => {
  const [isSwitching, setIsSwitching] = useState(false);

  // Switch chain to the specified chain from bunzz application
  const switchChain = async () => {
    try {
      setIsSwitching(true);

      // Request to switch chain
      await window.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + chainId.toString(16) }],
      });
    } catch (error) {
      console.log(error);
      // If the specified chain is not set in the user's metamask, request the addition of a chain
      if ((error as any).code === 4902) {
        await window.ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [NETWORK_INFO],
        });
      }
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <Button onClick={switchChain} isLoading={isSwitching}>
      Switch chain
    </Button>
  );
};
