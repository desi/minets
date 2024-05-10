import React from "react";
import bnb from "../anvil/token-imgs/erc20/bnb.png";
import busd from "../anvil/token-imgs/erc20/busd.png";
import dai from "../anvil/token-imgs/erc20/dai.png";
import matic from "../anvil/token-imgs/erc20/matic.png";
import stat from "../anvil/token-imgs/erc20/stat.png";
import uni from "../anvil/token-imgs/erc20/uni.png";
import usdc from "../anvil/token-imgs/erc20/usdc.png";
import usdt from "../anvil/token-imgs/erc20/usdt.png";
import weth from "../anvil/token-imgs/erc20/weth.png";

import "./ERC20.css";

const ERC20Tokens = () => {
  const tokens = [
    { name: "BNB", image: bnb },
    { name: "BUSD", image: busd },
    { name: "DAI", image: dai },
    { name: "MATIC", image: matic },
    { name: "STAT", image: stat },
    { name: "UNI", image: uni },
    { name: "USDC", image: usdc },
    { name: "USDT", image: usdt },
    { name: "WETH", image: weth },
  ];

  return (
    <section className="ERC20">
      <h2>ERC20 Tokens</h2>
      <div className="tokens">
        {tokens.map((token) => (
          <div key={token.name} className="token">
            <div className="img-wrapper">
              <img src={token.image} alt={token.name} />
            </div>
            <span>{token.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ERC20Tokens;
