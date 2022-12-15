import { FC } from 'react';
import Check from '../../assets/svgs/check.svg';
import { NETWORK_INFO, UseBunzzReturns } from '../../hooks/useBunzz';
import { Button } from '../Button/Button';
import { NumberInput } from '../Input/NumberInput/NumberInput';

type Props = UseBunzzReturns & {
  setAmount: (amount: number) => void;
  amount: number;
};

export const MintForm: FC<Props> = ({
  signerAddr,
  amount,
  isMinting,
  cost,
  setAmount,
  mint,
  mintedNum,
  maxSupply,
}) => {
  return (
    <div>
      <div className="address-box">
        <img src={Check} className="address-box-check" />
        <span>Wallet {signerAddr} connected</span>
      </div>
      <div className="mint-form">
        <div className="amount-wrapper">
          <NumberInput onChange={setAmount} value={amount} max={10} min={1} />
        </div>
        <Button
          variant="solid"
          onClick={() => mint(amount)}
          isLoading={isMinting}
          style={{ width: '100%' }}
          disabled={mintedNum === maxSupply}
        >
          {mintedNum === maxSupply
            ? 'All minted'
            : `Mint now (${Number(cost) * amount} ${
                NETWORK_INFO.nativeCurrency.symbol
              })`}
        </Button>
      </div>
    </div>
  );
};
