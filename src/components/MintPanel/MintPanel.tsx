import { NETWORK_INFO, UseBunzzReturns } from 'hooks/useBunzz';
import { FC, useState } from 'react';
import { ConnectWallet } from '../ConnectWallet/ConnectWallet';
import { MintForm } from '../MintForm/MintForm';
import { NftList } from '../NftList/NftList';
import { SwitchChain } from '../SwitchChain/SwitchChain';
import './MintPanel.css';

type Props = UseBunzzReturns & {
  imageSrc: string;
};

export const MintPanel: FC<Props> = (props) => {
  const {
    imageSrc,
    maxSupply,
    cost,
    mintedNum,
    signerAddr,
    isCorrectChain,
    metadataList,
  } = props;
  const [amount, setAmount] = useState(1);

  const MintBody = () => {
    if (signerAddr && isCorrectChain)
      return <MintForm {...props} setAmount={setAmount} amount={amount} />;
    if (signerAddr && !isCorrectChain) return <SwitchChain />;

    return <ConnectWallet />;
  };

  return (
    <div className="connect-btn">
      <div className="card">
        <div className="card-container">
          <img src={imageSrc} alt="nft image" className="mint-card-image" />
          <div className="mint-card-info">
            <div>
              <div className="numbers">
                {mintedNum.toLocaleString()} / {maxSupply.toLocaleString()}
              </div>
              <div className="bar-base">
                <div
                  className="bar"
                  style={{ width: `${(mintedNum / maxSupply) * 100}%` }}
                ></div>
              </div>
              <div className="body-1">
                1ST costs {cost} {NETWORK_INFO.nativeCurrency.symbol}, excluding
                gas fees.
              </div>
            </div>
            <MintBody />
          </div>
        </div>
        <NftList metadataList={metadataList} />
      </div>
    </div>
  );
};
