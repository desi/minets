import React, { Component } from 'react';
import './Home.css';

const {
  setStorage,
  stopServer,
} = require('../anvil/network-configs/mainnet')
const LocalNetwork = require('../anvil/anvil-setup');
const options = {
  blockTime: 2,
  chainId: 1,
  port: 8545,
  forkUrl: `https://mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8`,
  forkBlockNumber: 19460144,
};
let anvil;

class Home extends Component {
  constructor(props) {
    super(props);
    this.connectToAnvil = this.connectToAnvil.bind(this);
  }

  connectToAnvil = async () => {
    try {
      console.log("starting anvil server from home.js");
      anvil = new LocalNetwork();
      await anvil.start(options);
      console.log('Anvil server started successfully.');
    } catch (error) {
      console.error('Error connecting to Anvil:', error);
  }};

  render() {
    return (
      <div className="Home">
        <section className="connect-section">
          <button className="connect-btn" onClick={this.connectToAnvil}>
            Spin up Minets!
          </button>
        </section>
      </div>
    );
  };
};
export default Home;
