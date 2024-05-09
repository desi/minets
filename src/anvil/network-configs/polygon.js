const { hexToString } = require('./utils');
const { keccak256 } = require('@ethersproject/keccak256')

const DEFAULT_SRP = "spread raise short crane omit tent fringe mandate neglect detail suspect cradle";

const POLYGON_CONFIG = {
  blockTime: 2,
  chainId: 137,
  port: 8546,
  forkUrl: `https://polygon-mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8`,
  forkBlockNumber: 54810322,
  mnemonic: DEFAULT_SRP,
  silent: false,
};

const POLYGON_ERC20_CONTRACT_ADDRESSES = {
  DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  UNI: '0xb33EaAd8d922B1083446DC23f610c2567fB5180f',
  WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
}

const POLYGON_ERC721_CONTRACT_ADDRESSES = {
  NEBULA: '0x0F81af21d67B2CD7e836E6A10274404f5EDa5176',
}

function getPolygonERC20ContractStorages(addressWithoutPrefix) {
  const STORAGE_SLOT = {
      DAI: `00000000000000000000000${addressWithoutPrefix}0000000000000000000000000000000000000000000000000000000000000000`, // balanceOf
      UNI: `00000000000000000000000${addressWithoutPrefix}0000000000000000000000000000000000000000000000000000000000000000`, // balanceOf
    };

  const POLYGON_ERC20_BALANCE_SEED = [
    {
      address: POLYGON_ERC20_CONTRACT_ADDRESSES.DAI,
      index: `${keccak256(hexToString(STORAGE_SLOT.DAI))}`,
      value: "0x000000000000000000000000000000000000000000000002B5E3AF16B1880000"
    },
    {
      address: POLYGON_ERC20_CONTRACT_ADDRESSES.UNI,
      index: `${keccak256(hexToString(STORAGE_SLOT.UNI))}`,
      value: "0x000000000000000000000000000000000000000000000002B5E3AF16B1880000"
    },
  ]

  return POLYGON_ERC20_BALANCE_SEED;
};

function getPolygonERC721ContractStorages(addressWithoutPrefix) {
  const STORAGE_SLOT = {
    NEBULA: `00000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000002`, // ownerOf
  };

  const POLYGON_ERC721_BALANCE_SEED = [
    {
      address: POLYGON_ERC721_CONTRACT_ADDRESSES.NEBULA,
      index: `${keccak256(hexToString(STORAGE_SLOT.NEBULA))}`,
      value: `0x000000000000000000000000${addressWithoutPrefix}`
    },
  ]

  return POLYGON_ERC721_BALANCE_SEED;
};


module.exports = {
  getPolygonERC20ContractStorages,
  getPolygonERC721ContractStorages,
  POLYGON_CONFIG,
};