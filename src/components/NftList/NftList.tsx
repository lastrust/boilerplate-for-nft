import { FC } from 'react';
import { NFTCard } from '../Card/Nft/Nft';

type MetaData = { name: string; imageURI: string };

type Props = {
  metadataList?: MetaData[];
};

export const NftList: FC<Props> = ({ metadataList }) => {
  if (metadataList && metadataList.length !== 0) return null;

  return (
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
  );
};
