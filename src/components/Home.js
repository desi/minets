import React, { Component } from "react";
import ERC20Tokens from "./ERC20Tokens";
import ERC721Tokens from "./ERC721Tokens";
import avalanche from "../anvil/network-imgs/avalanche.png";
import binance from "../anvil/network-imgs/binance.png";
import ethereum from "../anvil/network-imgs/ethereum.png";
import polygon from "../anvil/network-imgs/polygon.png";

import "./Home.css";

const { setDefaultStorage } = require("../anvil/network-configs/utils");

const {
  getMainnetERC20ContractStorages,
  getMainnetERC721ContractStorages,
  MAINNET_CONFIG,
} = require("../anvil/network-configs/mainnet");

const {
  getPolygonERC20ContractStorages,
  getPolygonERC721ContractStorages,
  POLYGON_CONFIG,
} = require("../anvil/network-configs/polygon");

const DEFAULT_SRP =
  "spread raise short crane omit tent fringe mandate neglect detail suspect cradle";

const NETWORKS = {
  Mainnet: {
    config: MAINNET_CONFIG,
    erc20Contracts: getMainnetERC20ContractStorages,
    erc721Contracts: getMainnetERC721ContractStorages,
    img: ethereum,
  },
  Polygon: {
    config: POLYGON_CONFIG,
    erc20Contracts: getPolygonERC20ContractStorages,
    erc721Contracts: getPolygonERC721ContractStorages,
    img: polygon,
  },
  Avalanche: {
    config: "",
    erc20Contracts: "",
    erc721Contracts: "",
    img: avalanche,
  },
  Binance: {
    config: "",
    erc20Contracts: "",
    erc721Contracts: "",
    img: binance,
  },
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      networks: [
        { name: "Mainnet", started: false },
        { name: "Polygon", started: false },
        { name: "Avalanche", started: false },
        { name: "Binance", started: false },
      ],
      accounts: [],
      accountsSeeded: {},
      customAccountAddress: "",
      customAccountSeeded: false,
      erc721Address: "",
      erc721AddressSeeded: false,
    };
    this.startNetwork = this.startNetwork.bind(this);
    this.getAccounts = this.getAccounts.bind(this);
    this.seedAccountsERC20 = this.seedAccountsERC20.bind(this);
    this.seedERC20CustomAccount = this.seedERC20CustomAccount.bind(this);
    this.seedERC721CustomAccount = this.seedERC721CustomAccount.bind(this);
    this.getBalance = this.getBalance.bind(this);
    this.handleCustomAccountChange = this.handleCustomAccountChange.bind(this);
    this.handleAccountERC721Change = this.handleAccountERC721Change.bind(this);
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.anvil !== this.props.anvil && this.props.anvil) {
      await this.getAccounts();
    }
  }

  startNetwork = async (networkName) => {
    try {
      const network = NETWORKS[networkName];
      if (!network) {
        console.error(`Network ${networkName} not found.`);
        return;
      }
      console.log("starting anvil server from home.js");
      await this.props.startServer(network.config);
      console.log("Anvil server started successfully.");
      const updatedNetworks = this.state.networks.map((network) => {
        if (network.name === networkName) {
          return { ...network, started: true };
        }
        return network;
      });
      this.setState({ networks: updatedNetworks });
    } catch (error) {
      console.error("Error connecting to Anvil:", error);
    }
  };

  getAccounts = async () => {
    try {
      const accounts = await this.props.anvil.getAccounts();
      this.setState({ accounts });
      console.log("Accounts set:", accounts);
    } catch (error) {
      console.error("Error getting accounts:", error);
    }
  };

  seedAccountsERC20 = async (networkName) => {
    try {
      const { accounts } = this.state;
      const accountsSeeded = {};
      const network = NETWORKS[networkName];
      for (const account of accounts) {
        const addressWithoutPrefix = account.substring(2).toLowerCase();
        const contracts = network.erc20Contracts(addressWithoutPrefix);
        await setDefaultStorage(this.props.anvil, account, contracts);
        accountsSeeded[account] = Math.round(await this.getBalance(account));
      }
      this.setState({ accountsSeeded });
      console.log("Accounts seeded:", accountsSeeded);
    } catch (error) {
      console.error("Error seeding accounts:", error);
    }
  };

  handleCustomAccountChange(event) {
    this.setState({ customAccountAddress: event.target.value });
  }

  handleAccountERC721Change(event) {
    this.setState({ erc721Address: event.target.value });
  }

  seedERC20CustomAccount(networkName) {
    const { customAccountAddress } = this.state;
    const network = NETWORKS[networkName];
    if (customAccountAddress.trim() !== "") {
      const addressWithoutPrefix = customAccountAddress
        .substring(2)
        .toLowerCase();
      const contracts = network.erc20Contracts(addressWithoutPrefix);
      setDefaultStorage(this.props.anvil, customAccountAddress, contracts)
        .then(() => {
          this.setState({ customAccountSeeded: true });
          console.log(
            `Custom account ${customAccountAddress} seeded successfully.`
          );
        })
        .catch((error) => {
          console.error(
            `Error seeding custom account ${customAccountAddress}:`,
            error
          );
        });
    } else {
      console.error("Custom account address is required.");
    }
  }

  seedERC721CustomAccount(networkName) {
    const { erc721Address } = this.state;
    const network = NETWORKS[networkName];
    if (erc721Address.trim() !== "") {
      const addressWithoutPrefix = erc721Address.substring(2).toLowerCase();
      const contracts = network.erc721Contracts(addressWithoutPrefix);
      setDefaultStorage(this.props.anvil, erc721Address, contracts)
        .then(() => {
          this.setState({ erc721AddressSeeded: true });
          console.log(`Custom account ${erc721Address} seeded successfully.`);
        })
        .catch((error) => {
          console.error(
            `Error seeding custom account ${erc721Address}:`,
            error
          );
        });
    } else {
      console.error("Custom account address is required.");
    }
  }

  getBalance = async (address) => {
    try {
      const balance = await this.props.anvil.getBalance(address);
      console.log(`Balance of ${address}:`, balance);
      return balance;
    } catch (error) {
      console.error("Error getting balance:", error);
    }
  };

  render() {
    const { anvil } = this.props;

    const {
      networks,
      accounts,
      accountsSeeded,
      customAccountAddress,
      customAccountSeeded,
      erc721Address,
      erc721AddressSeeded,
    } = this.state;

    return (
      <div className="Home">
        {!anvil ? (
          <section className="connect-section">
            <h1>Minets!</h1>
            {networks.map((network) => (
              <div className="network" key={network.name}>
                <img src={NETWORKS[network.name].img} alt={network.name} />
                <h2>{network.name}</h2>
                <button
                  className="connect-btn"
                  onClick={() => this.startNetwork(network.name)}
                >
                  Spin up {network.name}!
                </button>
              </div>
            ))}
            <h2>More Networks to Come!</h2>
          </section>
        ) : (
          <section>
            {networks.map((network) => (
              <div key={network.name}>
                {network.started ? (
                  <p>
                    {network.name} with chainId {network.chainId} Running on
                    port {network.port}
                  </p>
                ) : null}
              </div>
            ))}

            <h3>Default SRP: {DEFAULT_SRP}</h3>
            <h1>Accounts</h1>
            <table>
              <tbody>
                <tr>
                  <th>Account</th>
                  <th>Balance</th>
                </tr>
                {accounts.map((account, index) => {
                  return (
                    <tr key={index}>
                      <td>{account}</td>
                      <td>{accountsSeeded[account]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <ERC20Tokens />
            <div className="custom-account">
              <button
                className="seed-btn"
                onClick={() =>
                  this.seedAccountsERC20(
                    networks.find((network) => network.started).name
                  )
                }
              >
                Seed All Accounts
              </button>
            </div>

            <div className="custom-account">
              <input
                type="text"
                value={customAccountAddress}
                onChange={this.handleCustomAccountChange}
                placeholder="Enter custom account address"
              />
              <button
                onClick={() =>
                  this.seedERC20CustomAccount(
                    networks.find((network) => network.started).name
                  )
                }
              >
                Seed Custom Account
              </button>
              {customAccountSeeded && (
                <span style={{ color: "#4CE0B3" }}>
                  Custom account seeded successfully.
                </span>
              )}
            </div>
            <ERC721Tokens />
            <div className="custom-account">
              <input
                type="text"
                value={erc721Address}
                onChange={this.handleAccountERC721Change}
                placeholder="Enter custom account address"
              />
              <button
                onClick={() =>
                  this.seedERC721CustomAccount(
                    networks.find((network) => network.started).name
                  )
                }
              >
                Seed Custom Account
              </button>
              {erc721AddressSeeded && (
                <span style={{ color: "#4CE0B3" }}>
                  Custom account seeded successfully.
                </span>
              )}
            </div>
          </section>
        )}
      </div>
    );
  }
}
export default Home;
