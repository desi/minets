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

async function setDefaultStorage(anvil, addressToSeed, contracts) {
    const testClient = anvil.getProvider().testClient;
  
    // Set balance for the address
    try {
      await testClient.setBalance({
        address: addressToSeed,
        value: '0xA968163F0A57B400000'
      });
    } catch (e) {
      console.log(e);
    }
  
    // Modify storage for contracts
    for (const contract of contracts) {
      const { address, index, value } = contract;
      try {
        await testClient.setStorageAt({
          address,
          index,
          value
        });
      } catch (e) {
        console.log("ERROR", e);
      }
    }
}

async function setCustomStorage(anvil, address, slot,value) {
    const testClient = anvil.getProvider().testClient;

    try {
      await testClient.setStorageAt({
        address,
        index: slot,
        value
      });
    } catch (e) {
        console.log("ERROR", e);
    }
}


module.exports = {
    hexToString,
    setDefaultStorage,
    setCustomStorage,
};


