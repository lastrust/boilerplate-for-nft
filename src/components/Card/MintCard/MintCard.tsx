import { Button } from "components/Button/Button";
import { NumberInput } from "components/Input/NumberInput/NumberInput";
import { NETWORK_INFO, UseBunzzReturns } from "hooks/useBunzz";
import { FC, useState } from "react";
import "./MintCard.css";
import Check from "assets/svgs/check.svg";

type Props = UseBunzzReturns & {
  imageSrc: string;
};

export const MintCard: FC<Props> = (props) => {
  const {
    imageSrc,
    maxSupply,
    cost,
    mintedNum,
    signerAddr,
    isInitializing,
    isCorrectChain,
    isSwitching,
    metadataList,
    connect,
    switchChain,
  } = props;
  const [amount, setAmount] = useState(1);

  return (
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

          <div className="connect-btn">
            {signerAddr && isCorrectChain ? (
              <MintForm {...props} setAmount={setAmount} amount={amount} />
            ) : signerAddr && !isCorrectChain ? (
              <Button onClick={switchChain} isLoading={isSwitching}>
                Switch chain
              </Button>
            ) : (
              <>
                <div className="body-2">Connect to Ethereum Mainenet</div>
                <Button
                  variant="outline"
                  onClick={connect}
                  isLoading={isInitializing}
                >
                  Connect
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {metadataList && metadataList.length !== 0 && (
        <div className="owned-nfts-wrapper">
          <h3 className="owned-nfts-title">Owned NFTs</h3>

          <div className="owned-nfts">
            {metadataList?.map((metadata) => (
              <NFTCard
                key={metadata.name}
                src={metadata.imageURI}
                name={metadata.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

type MintFormProps = UseBunzzReturns & {
  setAmount: (amount: number) => void;
  amount: number;
};

const MintForm: FC<MintFormProps> = ({
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
          style={{ width: "100%" }}
          disabled={mintedNum === maxSupply}
        >
          {mintedNum === maxSupply
            ? "All minted"
            : `Mint now (${Number(cost) * amount} ${
                NETWORK_INFO.nativeCurrency.symbol
              })`}
        </Button>
      </div>
    </div>
  );
};

type NFTCardProps = {
  src: string;
  name: string;
};

const NFTCard: FC<NFTCardProps> = ({ src, name }) => {
  return (
    <div className="nft-card">
      <img src={src} className="nft-card-image" />

      <div className="nft-card-info">
        <div className="nft-card-info-name">{name}</div>
      </div>
    </div>
  );
};
