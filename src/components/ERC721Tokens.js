import React from 'react';
import cryptokitty from '../anvil/token-imgs/erc721/cryptokitty.png';
import ens from '../anvil/token-imgs/erc721/ens.gif';

import './ERC721.css';

const ERC721Tokens = () => {
  const tokens = [
    { name: 'CRYPTOKITTY', image: cryptokitty, id: '1359295' },
    { name: 'ENS', image: ens, id: '79233663829379634837589865448569342784712482819484549289560981379859480642508' },
  ];

  return (
    <section className="ERC721">
      <h2>ERC20 Tokens</h2>
      <div className="tokens">
        {tokens.map(token => (
          <div key={token.name} className="token">
            <img src={token.image} alt={token.name} />
            <span>{token.name}</span>
            <span>Token Id: {token.id}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ERC721Tokens;