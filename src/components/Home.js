import React, { Component } from 'react';
import './Home.css';

const { setStorage } = require('../anvil/network-configs/mainnet')
const LocalNetwork = require('../anvil/anvil-setup');

//TODO: Automate getting latest block number so not hardcoded
const options = {
  blockTime: 2,
  chainId: 1,
  port: 8545,
  forkUrl: `https://mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8`,
  forkBlockNumber: 19460144,
  mnemonic: 'spread raise short crane omit tent fringe mandate neglect detail suspect cradle',
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
    }
    this.startAnvil = this.startAnvil.bind(this);
    this.getAccounts = this.getAccounts.bind(this);
    this.seedAccounts = this.seedAccounts.bind(this);
    this.stopAnvil = this.stopAnvil.bind(this);
    this.getBalance = this.getBalance.bind(this);
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
      let accountBalance;
      for (const account of accounts) {
        await setStorage(anvil, account);
        accountBalance = await this.getBalance(account);
        accountsSeeded[account] = accountBalance;
      }
      this.setState({ accountsSeeded });
      console.log('Accounts seeded:', accountsSeeded);
    } catch (error) {
      console.error('Error seeding accounts:', error);
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
    const { anvilStarted, accounts, accountsSeeded } = this.state;

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
