import { NETWORK_INFO } from 'hooks/useBunzz';
import { FC, useState } from 'react';
import { UseContractReturns } from '../../hooks/useContract';
import { ConnectWallet } from '../ConnectWallet/ConnectWallet';
import { MintForm } from '../MintForm/MintForm';
import { NftList } from '../NftList/NftList';
import './MintPanel.css';

type Props = UseContractReturns & {
  imageSrc: string;
  connectHandler: () => void;
  signerAddr: string;
};

export const MintPanel: FC<Props> = (props) => {
  const {
    imageSrc,
    maxSupply,
    cost,
    mintedNum,
    signerAddr,
    metadataList,
    connectHandler,
  } = props;
  const [amount, setAmount] = useState(1);

  const MintBody = () => {
    if (signerAddr !== 'undefined')
      return <MintForm {...props} setAmount={setAmount} amount={amount} />;

    return <ConnectWallet onClickHandler={connectHandler} />;
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
