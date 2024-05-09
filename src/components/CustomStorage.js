import React, { Component } from 'react';
import { exec } from 'child_process';
import fs from 'fs';
import './CustomStorage.css';
const {
  setCustomStorageBalanceOf
} = require('../anvil/network-configs/mainnet')

class CustomStorage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contractName: '',
      contractCode: '',
      svgContent: '',
      contract: '',
      slot: '',
      address: '',
      value: ''
    };
    this.generateContractLayout = this.generateContractLayout.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStorageChange = this.handleStorageChange.bind(this);
    this.handleStorageSubmit = this.handleStorageSubmit.bind(this);
  }

  generateContractLayout(contractCode, contractName) {
    const solFilePath = './contract.sol'; // Provide the path to a temporary directory
    fs.writeFile(solFilePath, contractCode, (err) => {
      if (err) {
        console.error(`Error writing contract code to file: ${err}`);
        return;
      }
      exec(`sol2uml storage ${solFilePath} -c ${contractName}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        // The stdout should contain the SVG content
        const pathMatch = stdout.match(/\/.+/);
        if (pathMatch && pathMatch.length > 0) {
          const filePath = pathMatch[0];
          this.readSVGFile(filePath);
        } else {
          console.error(`Error: Path not found in output: ${stdout}`);
        }
      });
    });
  }

  readSVGFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading SVG file: ${err}`);
        return;
      }
      this.setState({ svgContent: data });
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { contract, slot, address, value } = this.state;
    setCustomStorageBalanceOf(anvil, contract, slot, address, value)
    console.log('Submitting:', contract, slot, address, value);
    // Clear form fields
    this.setState({ contract: '', slot: '', address: '', value: '' });
  }

  handleStorageChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleStorageSubmit(e) {
    e.preventDefault();
    const { contractCode, contractName } = this.state;
    this.generateContractLayout(contractCode, contractName);
  }

  render() {
    const { svgContent, contract, slot, address, value } = this.state;

    return (
      <div className="CustomStorage">
        <h1>Custom Storage</h1>
        <h2>Step 1: Get the Contract Storage Layout</h2>
        <form className="storageLayout" onSubmit={this.handleStorageSubmit}>
          <label htmlFor="contractCode">Contract Code:</label>
          <textarea id="contractCode" name="contractCode" value={this.state.contractCode} onChange={this.handleStorageChange} />
          <label htmlFor="contractName">Contract Name:</label>
          <textarea id="contractName" name="contractName" value={this.state.contractName} onChange={this.handleStorageChange} />
          <button type="submit">Generate Layout</button>
        </form>
        <div className='svg'>
          {svgContent && (
              <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`} alt="Contract Layout" />
            )}
        </div>
        <h2>Step 2: Set the Storage values</h2>
        <p>INSTRUCTIONS GO HERE</p>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="contract">Contract Address:</label>
            <input
              type="text"
              id="contract"
              value={contract}
              onChange={(e) => this.setState({ contract: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="slot">Slot:</label>
            <input
              type="text"
              id="slot"
              value={slot}
              onChange={(e) => this.setState({ slot: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => this.setState({ address: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="value">Value:</label>
            <input
              type="text"
              id="value"
              value={value}
              onChange={(e) => this.setState({ value: e.target.value })}
              required
            />
          </div>
          <button type="submit">Set Custom Storage Balance</button>
        </form>
      </div>
    );
  }
}

export default CustomStorage;
