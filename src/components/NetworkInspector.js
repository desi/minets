import React, { Component } from "react";
import { faCube, faGasPump } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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



  render() {
    const {
      blockNumber,
      gasPrice,
    } = this.state;

    return (
      <div className="NetworkInspector">
        <h1>Network Inspector</h1>
        <p>Make sure that your server is running</p>
        <div className="data-container">
          <div className="data">
            <h2>
              <FontAwesomeIcon icon={faCube} />Get block number
            </h2>
            <p>{blockNumber}</p>
          </div>

          <hr />
          <div className="data">
            <h2>
              <FontAwesomeIcon icon={faGasPump} /> Gas Price
            </h2>
            <p>{gasPrice}</p>
          </div>
        </div>
         <hr />
         
        
    </div>
  );
  }
}

export default NetworkInspector;
