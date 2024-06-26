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

const MAINNET_ERC20_CONTRACT_ADDRESSES = {
    DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    BNB: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    STAT: '0x4FC15c91a9c4A9efB404174464687E8e128730C2',
}

const MAINNET_ERC721_CONTRACT_ADDRESSES = {
  CRYPTOKITTY: '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d',
  ENS: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
}

function getMainnetERC20ContractStorages(addressWithoutPrefix) {
    const STORAGE_SLOT = {
        DAI: `00000000000000000000000${addressWithoutPrefix}0000000000000000000000000000000000000000000000000000000000000002`, // balanceOf
        USDC: `00000000000000000000000${addressWithoutPrefix}0000000000000000000000000000000000000000000000000000000000000009`, // balanceOf
        WETH: `00000000000000000000000${addressWithoutPrefix}0000000000000000000000000000000000000000000000000000000000000003`,
        MATIC: `00000000000000000000000${addressWithoutPrefix}0000000000000000000000000000000000000000000000000000000000000000`,
        UNI: `00000000000000000000000${addressWithoutPrefix}0000000000000000000000000000000000000000000000000000000000000004`,
        BNB: `00000000000000000000000${addressWithoutPrefix}0000000000000000000000000000000000000000000000000000000000000005`,
        STAT: `00000000000000000000000${addressWithoutPrefix}0000000000000000000000000000000000000000000000000000000000000003`,
    };

    const MAINNET_ERC20_BALANCE_SEED = [
      {
        address: MAINNET_ERC20_CONTRACT_ADDRESSES.DAI,
        index: `${keccak256(hexToString(STORAGE_SLOT.DAI))}`,
        value: "0x000000000000000000000000000000000000000000000002B5E3AF16B1880000"
      },
      {
        address: MAINNET_ERC20_CONTRACT_ADDRESSES.USDC,
        index: `${keccak256(hexToString(STORAGE_SLOT.USDC))}`,
        value: "0x0000000000000000000000000000000000000000000000000000000002FAF080"
      },
      {
        address: MAINNET_ERC20_CONTRACT_ADDRESSES.WETH,
        index: `${keccak256(hexToString(STORAGE_SLOT.WETH))}`,
        value: "0x000000000000000000000000000000000000000000000002B5E3AF16B1880000"
      },
      {
        address: MAINNET_ERC20_CONTRACT_ADDRESSES.MATIC,
        index: `${keccak256(hexToString(STORAGE_SLOT.MATIC))}`,
        value: "0x000000000000000000000000000000000000000000000002B5E3AF16B1880000"
      },
      {
        address: MAINNET_ERC20_CONTRACT_ADDRESSES.UNI,
        index: `${keccak256(hexToString(STORAGE_SLOT.UNI))}`,
        value: "0x000000000000000000000000000000000000000000000002B5E3AF16B1880000"
      },
      {
        address: MAINNET_ERC20_CONTRACT_ADDRESSES.BNB,
        index: `${keccak256(hexToString(STORAGE_SLOT.BNB))}`,
        value: "0x000000000000000000000000000000000000000000000002B5E3AF16B1880000"
      },
      {
        address: MAINNET_ERC20_CONTRACT_ADDRESSES.STAT,
        index: `${keccak256(hexToString(STORAGE_SLOT.STAT))}`,
        value: "0x000000000000000000000000000000000000000000000002B5E3AF16B1880000"
      },
    ]

    return MAINNET_ERC20_BALANCE_SEED;
};

function getMainnetERC721ContractStorages(addressWithoutPrefix) {
  const STORAGE_SLOT = {
      CRYPTOKITTY: `000000000000000000000000000000000000000000000000000000000014bdbf0000000000000000000000000000000000000000000000000000000000000007`, // ownerOf
      ENS: `0x2eaa2c9551f6c5af9914f3936eb972729afde59fbc6876afeb6236102e88ea1a`,
  };
  const MAINNET_ERC721_BALANCE_SEED = [
    {
      address: MAINNET_ERC721_CONTRACT_ADDRESSES.CRYPTOKITTY,
      index: `${keccak256(hexToString(STORAGE_SLOT.CRYPTOKITTY))}`,
      value: `0x000000000000000000000000${addressWithoutPrefix}`
    },
    {
      address: MAINNET_ERC721_CONTRACT_ADDRESSES.ENS,
      index: STORAGE_SLOT.ENS,
      value: `0x000000000000000000000000${addressWithoutPrefix}`
    },
  ]

  return MAINNET_ERC721_BALANCE_SEED;
};


module.exports = {
  getMainnetERC20ContractStorages,
  getMainnetERC721ContractStorages,
  MAINNET_CONFIG,
};