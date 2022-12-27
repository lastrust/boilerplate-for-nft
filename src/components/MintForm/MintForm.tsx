import { FC } from 'react';
import Check from '../../assets/svgs/check.svg';
import { NETWORK_INFO } from '../../hooks/useBunzz';
import { UseContractReturns } from '../../hooks/useContract';
import { Button } from '../Button/Button';
import { NumberInput } from '../Input/NumberInput/NumberInput';

type Props = UseContractReturns & {
  setAmount: (amount: number) => void;
  amount: number;
  signerAddr: string;
};

export const MintForm: FC<Props> = ({
  contract,
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
          onClick={() => mint(contract, amount, signerAddr)}
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
