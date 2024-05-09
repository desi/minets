import React, { Component } from 'react';
import './Home.css';


const {
  setDefaultStorage
} = require('../anvil/network-configs/utils');

const {
  getMainnetContractStorages,
  MAINNET_CONFIG,
} = require('../anvil/network-configs/mainnet');

const {
  getPolygonContractStorages,
  POLYGON_CONFIG,
} = require('../anvil/network-configs/polygon');

const LocalNetwork = require('../anvil/anvil-setup');

const DEFAULT_SRP = "spread raise short crane omit tent fringe mandate neglect detail suspect cradle";

let anvil;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      mainnetStarted: false,
      polygonStarted: false,
      accountsSeeded: {},
      customAccountAddress: '',
      customAccountSeeded: false,

    }
    this.startMainnet = this.startMainnet.bind(this);
    this.startPolygon = this.startPolygon.bind(this);
    this.getAccounts = this.getAccounts.bind(this);
    this.seedAccounts = this.seedAccounts.bind(this);
    this.stopAnvil = this.stopAnvil.bind(this);
    this.getBalance = this.getBalance.bind(this);
    this.handleCustomAccountChange = this.handleCustomAccountChange.bind(this);
    this.seedCustomAccount = this.seedCustomAccount.bind(this);
  }

  startMainnet = async () => {
    try {
      console.log("starting anvil server from home.js");
      anvil = new LocalNetwork();
      await anvil.start(MAINNET_CONFIG);
      console.log('Anvil server started successfully.');
      await this.getAccounts(anvil);
      this.setState({ mainnetStarted: true });
    } catch (error) {
      console.error('Error connecting to Anvil:', error);
  }};

  startPolygon = async () => {
    try {
      console.log("Starting Polygon Anvil server from home.js");
      anvil = new LocalNetwork();
      await anvil.start(POLYGON_CONFIG);
      console.log('Polygon Anvil server started successfully.');
      await this.getAccounts(anvil); // You might need to implement getAccounts method for Polygon
      this.setState({ polygonStarted: true }); // Update the state to indicate Polygon server started
    } catch (error) {
      console.error('Error connecting to Polygon Anvil:', error);
    }
  };

  getAccounts = async () => {
    try {
      const accounts = await anvil.getAccounts();
      this.setState({ accounts });
      console.log('Accounts:', accounts);
    } catch (error) {
      console.error('Error getting accounts:', error);
    }
  }

  seedAccounts = async () => {
    try {
      const { accounts } = this.state;
      const accountsSeeded = {};
      let accountBalance;
      for (const account of accounts) {
        const addressWithoutPrefix = account.substring(2).toLowerCase();
        const contracts = getMainnetContractStorages(addressWithoutPrefix);
        await setDefaultStorage(anvil, account, contracts);
        accountsSeeded[account] = true;
      }
      this.setState({ accountsSeeded });
      console.log('Accounts seeded:', accountsSeeded);
    } catch (error) {
      console.error('Error seeding accounts:', error);
    }
  }

  handleCustomAccountChange(event) {
    this.setState({ customAccountAddress: event.target.value });
  }

  seedCustomAccount() {
    const { customAccountAddress } = this.state;
    if (customAccountAddress.trim() !== '') {
      const addressWithoutPrefix = customAccountAddress.substring(2).toLowerCase();
      const contracts = getMainnetContractStorages(addressWithoutPrefix);
      setDefaultStorage(anvil, customAccountAddress, contracts)
        .then(() => {
          this.setState({ customAccountSeeded: true });
          console.log(`Custom account ${customAccountAddress} seeded successfully.`);
        })
        .catch(error => {
          console.error(`Error seeding custom account ${customAccountAddress}:`, error);
        });
    } else {
      console.error('Custom account address is required.');
    }
  }

  stopAnvil = async () => {
    try {
      await anvil.quit();
      console.log('Anvil server stopped successfully.');
      this.setState({ mainnetStarted: false, accounts: [] });
    } catch (error) {
      console.error('Error stopping Anvil:', error);
    }
  }

  getBalance = async (address) => {
    try {
      const balance = await anvil.getBalance(address);
      console.log(`Balance of ${address}:`, balance);
      return balance;
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  }

  render() {
    const { 
      mainnetStarted,
      polygonStarted,
      accounts,
      accountsSeeded,
      customAccountAddress,
      customAccountSeeded,
    } = this.state;

    return (
      <div className="Home">
        {!mainnetStarted && !polygonStarted ? (
          <section className="connect-section">
            <h1>Minets!</h1>
            <button className="connect-btn" onClick={this.startMainnet}>
              Spin up Mainnet!
            </button>
              <button className="connect-btn" onClick={this.startPolygon}>
              Spin up Polygon!
            </button>
          </section>
        ) : (
          <section>
            
            {mainnetStarted ? 
            <p>Mainnet with chainId 1 Running on port 8545</p>
             :
            <p>Polygon with chainId 137 Running on port 8546</p>}

            <h3>Default SRP: {DEFAULT_SRP}</h3>
            <ul>
              {accounts.map((account, index) => (
                <li key={index}>
                  {account}
                  {accountsSeeded[account] && <span style={{ color: '#4CE0B3' }}>✓</span>}
                </li>
              ))}
            </ul>
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
                    )
                })}
              </tbody>
            </table>
            <button className="seed-btn" onClick={() => this.seedAccounts(anvil)}>
              Seed Accounts
            </button>
            <div className="custom-account">
              <input
                type="text"
                value={customAccountAddress}
                onChange={this.handleCustomAccountChange}
                placeholder="Enter custom account address"
              />
              <button onClick={this.seedCustomAccount}>Seed Custom Account</button>
              {customAccountSeeded && <span style={{ color: '#4CE0B3' }}>Custom account seeded successfully.</span>}
            </div>
            <button className="disconnect-btn" onClick={() => this.stopAnvil(anvil)}>
              Stop Anvil
            </button>
          </section>
        )}
      </div>
    );
  }
};
export default Home;
