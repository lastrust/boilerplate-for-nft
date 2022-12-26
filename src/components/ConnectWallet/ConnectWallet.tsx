import React from 'react';
import { Button } from '../Button/Button';

type Props = {
  onClickHandler: () => void;
};

export const ConnectWallet: React.FC<Props> = ({ onClickHandler }) => {
  return (
    <div className="connect-btn">
      <div className="body-2">
        Connect to Ethereum MainNet. Make sure your chainID included to list!
      </div>
      <Button variant="outline" onClick={onClickHandler}>
        Connect
      </Button>
    </div>
  );
};
