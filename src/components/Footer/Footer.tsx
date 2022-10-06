import { FC } from "react";
import "./Footer.css";
import Opensea from "assets/svgs/opensea.svg";
import Eye from "assets/svgs/eye.svg";
import TofuNFT from "assets/svgs/tofu-nft.svg";
import Discord from "assets/svgs/discord.svg";
import Twitter from "assets/svgs/twitter.svg";

export const Footer: FC = () => {
  return (
    <footer className="footer">
      <div className="footer-title-main">
        <div className="footer-title-wrapper">
          <h2 className="footer-title">Minting website</h2>
          <h3 className="footer-subtitle">Leadedge x Bunzz</h3>
        </div>

        <div className="links">
          <a href="#" target="_blank">
            <img src={Opensea} alt="opensea" />
          </a>
          <a href="#" target="_blank">
            <img src={Eye} alt="eye" />
          </a>
          <a href="#" target="_blank">
            <img src={TofuNFT} alt="tofu nft" />
          </a>
          <a href="#" target="_blank">
            <img src={Discord} alt="discord" />
          </a>
          <a href="#" target="_blank">
            <img src={Twitter} alt="twitter" />
          </a>
        </div>
      </div>

      <div className="copyright">
        Copyright © 2022 Bunzz Inc. All rights reserved.
      </div>
    </footer>
  );
};
