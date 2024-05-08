const { hexToString } = require('./utils');
const { keccak256 } = require('@ethersproject/keccak256')

const DEFAULT_SRP = "spread raise short crane omit tent fringe mandate neglect detail suspect cradle";

const MAINNET_CONFIG = {
  blockTime: 2,
  chainId: 1,
  port: 8545,
  forkUrl: `https://mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8`,
  forkBlockNumber: 19460144,
  mnemonic: DEFAULT_SRP,
  silent: false,
};

const MAINNET_CONTRACT_ADDRESSES = {
    DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    CRYPTOKITTY: '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d',
    ENS: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
}

function getMainnetContractStorages(addressWithoutPrefix) {
    const STORAGE_SLOT = {
        DAI: `00000000000000000000000${addressWithoutPrefix}0000000000000000000000000000000000000000000000000000000000000002`, // balanceOf
        USDC: `00000000000000000000000${addressWithoutPrefix}0000000000000000000000000000000000000000000000000000000000000009`, // balanceOf
        CRYPTOKITTY: `000000000000000000000000000000000000000000000000000000000014bdbf0000000000000000000000000000000000000000000000000000000000000007`, // ownerOf
        ENS: `0x2eaa2c9551f6c5af9914f3936eb972729afde59fbc6876afeb6236102e88ea1a`
    };

    const MAINNET_BALANCE_SEED = [
        {
        address: MAINNET_CONTRACT_ADDRESSES.DAI,
        index: `${keccak256(hexToString(STORAGE_SLOT.DAI))}`,
        value: "0x000000000000000000000000000000000000000000000002B5E3AF16B1880000"
      },
      {
        address: MAINNET_CONTRACT_ADDRESSES.USDC,
        index: `${keccak256(hexToString(STORAGE_SLOT.USDC))}`,
        value: "0x0000000000000000000000000000000000000000000000000000000002FAF080"
      },
      {
        address: MAINNET_CONTRACT_ADDRESSES.CRYPTOKITTY,
        index: `${keccak256(hexToString(STORAGE_SLOT.CRYPTOKITTY))}`,
        value: `0x000000000000000000000000${addressWithoutPrefix}`
      },
      {
        address: MAINNET_CONTRACT_ADDRESSES.ENS,
        index: STORAGE_SLOT.ENS,
        value: `0x000000000000000000000000${addressWithoutPrefix}`
      },
    ]

    return MAINNET_BALANCE_SEED;
};


module.exports = { getMainnetContractStorages, MAINNET_CONFIG };