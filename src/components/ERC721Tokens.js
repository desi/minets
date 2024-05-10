import React from "react";
import cryptokitty from "../anvil/token-imgs/erc721/cryptokitty.png";
import ens from "../anvil/token-imgs/erc721/ens.gif";

import "./ERC721.css";

const ERC721Tokens = () => {
  const tokens = [
    {
      name: "CRYPTOKITTY",
      image: cryptokitty,
      contract: "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d",
      id: "1359295",
    },
    {
      name: "ENS",
      image: ens,
      contract: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
      id: "79233663829379634837589865448569342784712482819484549289560981379859480642508",
    },
  ];

  return (
    <section className="ERC721">
      <h2>ERC721 Tokens</h2>
      <div className="tokens">
        {tokens.map((token) => (
          <div key={token.name} className="token">
            <img src={token.image} alt={token.name} />
            <div className="token-data">
              <span className="name">{token.name}</span>
              <span className="contract">{token.contract}</span>
              <span className="tokenId">Token Id: {token.id}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ERC721Tokens;
