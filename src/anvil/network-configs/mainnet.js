const LocalNetwork = require('../anvil-setup');
const { keccak256 } = require('@ethersproject/keccak256')

const options = {
  blockTime: 2,
  chainId: 1,
  port: 8545,
  forkUrl: `https://mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8`,
  forkBlockNumber: 19460144,
};

let serverProcess;


function hexToString(hex) {
  if (!hex.match(/^[0-9a-fA-F]+$/)) {
    throw new Error('is not a hex string.');
  }
  if (hex.length % 2 !== 0) {
    hex = '0' + hex;
  }
  var bytes = [];
  for (var n = 0; n < hex.length; n += 2) {
    var code = parseInt(hex.substr(n, 2), 16)
    bytes.push(code);
  }
  return bytes;
}

async function startServer() {
  const anvil = new LocalNetwork();
  await anvil.start(options);
  console.log('Anvil server started successfully.');
  return anvil;
}

async function setCustomStorageBalanceOf(anvil, contract, slot, address, value) {
  const testClient = anvil.getProvider().testClient;
  
  const addressWithoutPrefix = address.substring(2).toLowerCase();
    const formatSlot = `00000000000000000000000${addressWithoutPrefix}000000000000000000000000000000000000000000000000000000000000000${slot}`;
    const hashedSlot = keccak256(hexToString(formatSlot));
    const paddedValue = value.padStart(64, '0');
    const storageValue = `0x${hashedSlot}${paddedValue}`;
    
  console.log(hashedSlot)
  console.log(storageValue)
    try {
      await testClient.setStorageAt({
        address: contract,
        index: hashedSlot,
        value: storageValue
      })
    } catch (e) {
      console.log(e)
    }
    return { slot: hashedSlot, value: storageValue };
}

async function setStorage(anvil, addressToSeed) {
  const testClient = anvil.getProvider().testClient;
  const publicClient = anvil.getProvider().publicClient;

  const addressWithoutPrefix = addressToSeed.substring(2).toLowerCase();

  try {
    await testClient.setBalance({
      address: addressToSeed,
      value: '0xA968163F0A57B400000'
    })

  } catch (e) {
    console.log(e)
  }

  // Modify DAI Contract Storage to own 50 DAI
  const DAI = "0x6b175474e89094c44da98b954eedeac495271d0f";
  let DAI_SLOT = `00000000000000000000000${addressWithoutPrefix}0000000000000000000000000000000000000000000000000000000000000002`;
  DAI_SLOT = `${keccak256(hexToString(DAI_SLOT))}`
  const DAI_VALUE = "0x000000000000000000000000000000000000000000000002B5E3AF16B1880000";

  try {
    await testClient.setStorageAt({
      address: DAI,
      index: DAI_SLOT,
      value: DAI_VALUE
    })
  } catch (e) {
    console.log(e)
  }

  // Modify USDC Contract Storage to own 50 USDC
  const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  let USDC_SLOT = `00000000000000000000000${addressWithoutPrefix}0000000000000000000000000000000000000000000000000000000000000009`;
  USDC_SLOT = `${keccak256(hexToString(USDC_SLOT))}`
  const USDC_VALUE = '0x0000000000000000000000000000000000000000000000000000000002FAF080'

  try {
    await testClient.setStorageAt({
      address: USDC,
      index: USDC_SLOT,
      value: USDC_VALUE
      })
  } catch (e) {
    console.log("ERROR", e)
  }

  //TODO: Break this out into a separate function so that we can assign
  // to just the first account. Otherwise the last account is always the owner

  // Modify CRYPTOKITTY Contract Storage to Own a CRYPTOKITTY
  // tokenId = 1359295
  const CRYPTOKITTY = "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d";
  let CRYPTOKITTY_SLOT = `000000000000000000000000000000000000000000000000000000000014bdbf0000000000000000000000000000000000000000000000000000000000000007`
  CRYPTOKITTY_SLOT = `${keccak256(hexToString(CRYPTOKITTY_SLOT))}`
  const CRYPTOKITTY_VALUE = `0x000000000000000000000000${addressWithoutPrefix}`;

  await testClient.setStorageAt({
    address: CRYPTOKITTY,
    index: CRYPTOKITTY_SLOT,
    value: CRYPTOKITTY_VALUE
  })

  //TODO: Break this out into a separate function so that we can assign
  // to just the first account. Otherwise the last account is always the owner
  
  // Modify ENS Contract Storage to Own an ENS
  // tokenId = 79233663829379634837589865448569342784712482819484549289560981379859480642508
  const ENS = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85";
  const ENS_SLOT = "0x2eaa2c9551f6c5af9914f3936eb972729afde59fbc6876afeb6236102e88ea1a";
  const ENS_VALUE = `0x000000000000000000000000${addressWithoutPrefix}`;

  await testClient.setStorageAt({
    address: ENS,
    index: ENS_SLOT,
    value: ENS_VALUE
  });

}

async function stopServer(anvil) {
  await anvil.quit()
  console.log('Anvil server stopped successfully.');
}

module.exports = { startServer, stopServer, setStorage, setCustomStorageBalanceOf };
