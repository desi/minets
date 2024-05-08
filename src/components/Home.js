import React, { Component } from 'react';
import './Home.css';

const {
  setStorage,
  stopServer,
} = require('../anvil/network-configs/mainnet');

const LocalNetwork = require('../anvil/anvil-setup');

const DEFAULT_SRP = "spread raise short crane omit tent fringe mandate neglect detail suspect cradle";
const options = {
  blockTime: 2,
  chainId: 1,
  port: 8545,
  forkUrl: `https://mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8`,
  forkBlockNumber: 19460144,
  mnemonic: DEFAULT_SRP,
  silent: false,
};

let anvil;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      anvilStarted: false,
      accountsSeeded: {},
      customAccountAddress: '',
      customAccountSeeded: false,

    }
    this.startAnvil = this.startAnvil.bind(this);
    this.getAccounts = this.getAccounts.bind(this);
    this.seedAccounts = this.seedAccounts.bind(this);
    this.stopAnvil = this.stopAnvil.bind(this);
    this.handleCustomAccountChange = this.handleCustomAccountChange.bind(this);
    this.seedCustomAccount = this.seedCustomAccount.bind(this);
  }


  startAnvil = async () => {
    try {
      console.log("starting anvil server from home.js");
      anvil = new LocalNetwork();
      await anvil.start(options);
      console.log('Anvil server started successfully.');
      await this.getAccounts(anvil);
      this.setState({ anvilStarted: true });
    } catch (error) {
      console.error('Error connecting to Anvil:', error);
  }};

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
      for (const account of accounts) {
        await setStorage(anvil, account);
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
      setStorage(anvil, customAccountAddress)
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
      this.setState({ anvilStarted: false, accounts: [] });
    } catch (error) {
      console.error('Error stopping Anvil:', error);
    }
  }

  render() {
    const { anvilStarted, accounts, accountsSeeded, customAccountAddress, customAccountSeeded } = this.state;

    return (
      <div className="Home">
        {!anvilStarted ? (
          <section className="connect-section">
            <button className="connect-btn" onClick={this.startAnvil}>
              Spin up Minets!
            </button>
          </section>
        ) : (
          <section>
            <h1>Accounts</h1>
            <h3>Default SRP: {DEFAULT_SRP}</h3>
            <ul>
              {accounts.map((account, index) => (
                <li key={index}>
                  {account}
                  {accountsSeeded[account] && <span style={{ color: '#4CE0B3' }}>✓</span>}
                </li>
              ))}
            </ul>
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
