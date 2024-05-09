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

const POLYGON_CONTRACT_ADDRESSES = {
  DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
}

function getPolygonContractStorages(addressWithoutPrefix) {
  const STORAGE_SLOT = {
      DAI: '', // balanceOf
      USDC: '', // balanceOf
  };

  const POLYGON_BALANCE_SEED = [
      {
      address: POLYGON_CONTRACT_ADDRESSES.DAI,
      index: `${keccak256(hexToString(STORAGE_SLOT.DAI))}`,
      value: "0x000000000000000000000000000000000000000000000002B5E3AF16B1880000"
    },
    {
      address: POLYGON_CONTRACT_ADDRESSES.USDC,
      index: `${keccak256(hexToString(STORAGE_SLOT.USDC))}`,
      value: "0x0000000000000000000000000000000000000000000000000000000002FAF080"
    },
  ]

  return POLYGON_BALANCE_SEED;
};


module.exports = { getPolygonContractStorages, POLYGON_CONFIG };