import React, { Component } from "react";
import { setCustomStorage } from "../anvil/network-configs/utils";
import "./NetworkInspector.css";

class NetworkInspector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockNumber: "",
      gasPrice: "",
      storage: "",
      contractAddress: "",
      storagePosition: "",
    };
    this.getBlockNumber = this.getBlockNumber.bind(this);
    this.getGasPrice = this.getGasPrice.bind(this);
    this.getStorageAt = this.getStorageAt.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleGetStorageAt = this.handleGetStorageAt.bind(this);
  }

  async componentDidMount() {
    if(!this.props.anvil) {
      return;
    }
    await this.getBlockNumber();
    await this.getGasPrice();
  }

  async getBlockNumber() {
    const publicClient = this.props.anvil.getProvider().publicClient;
    const blockNumber = await publicClient.getBlockNumber();
    this.setState({ blockNumber: Number(blockNumber) });
  }

  async getGasPrice() {
    const publicClient = this.props.anvil.getProvider().publicClient;
    const gasPrice = await publicClient.getGasPrice();
    this.setState({ gasPrice: Number(gasPrice) });
  }

  async getStorageAt(contract, storagePos) {
    const publicClient = this.props.anvil.getProvider().publicClient;
    const storage = await publicClient.getStorageAt(
      {
        address: contract,
        slot: storagePos,
      }
    );
    this.setState({ storage: storage });
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleGetStorageAt = async (event) => {
    event.preventDefault();
    const { contractAddress, storagePosition } = this.state;
    await this.getStorageAt(contractAddress, storagePosition);
  }

  render() {
    const {
      blockNumber,
      gasPrice,
      storage,
    } = this.state;

    return (
      <div className="NetworkInspector">
        <h1>Network Inspector</h1>
        <p>Make sure that your server is running</p>
        <div className="data">
          <h2>Get block number</h2>
          <p>{blockNumber}</p>
        </div>

        <hr />
        <div className="data">
          <h2>Gas Price</h2>
          <p>{gasPrice}</p>
        </div>

         <hr />
         
      <h2>Get Storage At</h2>
      <form onSubmit={this.handleGetStorageAt}>
          <label htmlFor="contractAddress">Contract Address:</label>
          <input
            type="text"
            id="contractAddress"
            name="contractAddress"
            value={this.state.contractAddress}
            onChange={this.handleInputChange}
          />
          <label htmlFor="storagePosition">Storage Position:</label>
          <input
            type="text"
            id="storagePosition"
            name="storagePosition"
            value={this.state.storagePosition}
            onChange={this.handleInputChange}
          />
          <button type="submit">Get Storage At</button>
        </form>
        <p>{storage}</p>

    </div>
  );
  }
}

export default NetworkInspector;
