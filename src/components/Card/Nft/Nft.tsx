import { FC } from 'react';

type Props = {
  src: string;
  name: string;
};

export const NFTCard: FC<Props> = ({ src, name }) => {
  return (
    <div className="nft-card">
      <img src={src} className="nft-card-image" />
      <div className="nft-card-info">
        <div className="nft-card-info-name">{name}</div>
      </div>
    </div>
  );
};
