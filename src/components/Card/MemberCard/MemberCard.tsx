import Twitter from 'assets/svgs/twitter-black.svg';
import { FC } from 'react';
import './MemberCard.css';

type Props = {
  imageSrc: string;
  name: string;
  role: string;
  twitterLink: string;
};

export const MemberCard: FC<Props> = ({
  imageSrc,
  name,
  role,
  twitterLink,
}) => {
  return (
    <div className="member-card">
      <img src={imageSrc} alt="member profile" className="image" />

      <div className="member-card-footer">
        <div>
          <div className="name">{name}</div>
          <div className="role">{role}</div>
        </div>

        <a
          className="twitter-btn"
          href={twitterLink}
          target="_blank"
          rel="noreferrer"
        >
          <img src={Twitter} />
        </a>
      </div>
    </div>
  );
};
