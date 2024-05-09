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
      contractAddress: '',
      slot: '',
      address: '',
      value: ''
    };
    this.generateContractLayout = this.generateContractLayout.bind(this);
    this.handleLayoutChange = this.handleLayoutChange.bind(this);
    this.handleLayoutSubmit = this.handleLayoutSubmit.bind(this);
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

  handleStorageSubmit(e) {
    e.preventDefault();
    const { contractAddress, slot, address, value } = this.state;
    setCustomStorageBalanceOf(anvil, contractAddress, slot, address, value)
    console.log('Submitting:', contractAddress, slot, address, value);
    // Clear form fields
    this.setState({ contractAddress: '', slot: '', address: '', value: '' });
  }

  handleLayoutChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleLayoutSubmit(e) {
    e.preventDefault();
    const { contractCode, contractName } = this.state;
    this.generateContractLayout(contractCode, contractName);
  }

  handleStorageChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  render() {
    const { svgContent, contractAddress, slot, address, value } = this.state;

    return (
      <div className="CustomStorage">
        <h1>Custom Storage</h1>
        <h2>Get the Contract Storage Layout</h2>
        <form className="storageLayout" onSubmit={this.handleLayoutSubmit}>
          <label htmlFor="contractCode">Contract Code:</label>
          <textarea id="contractCode" name="contractCode" value={this.state.contractCode} onChange={this.handleLayoutChange} />
          <label htmlFor="contractName">Contract Name:</label>
          <textarea id="contractName" name="contractName" value={this.state.contractName} onChange={this.handleLayoutChange} />
          <button type="submit">Generate Layout</button>
        </form>
        <div className='svg'>
          {svgContent && (
              <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`} alt="Contract Layout" />
            )}
        </div>

        <h2>Set the Storage values</h2>
        <p>INSTRUCTIONS GO HERE</p>
        <form onSubmit={this.handleStorageSubmit}>
          <div>
            <label htmlFor="contractAddress">Contract Address:</label>
            <input
              type="text"
              id="contractAddress"
              name="contractAddress"
              value={contractAddress}
              onChange={this.handleStorageChange}
              required
            />
          </div>
          <div>
            <label htmlFor="slot">Slot:</label>
            <input
              type="text"
              id="slot"
              name="slot"
              value={slot}
              onChange={this.handleStorageChange}
              required
            />
          </div>
          <div>
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={address}
              onChange={this.handleStorageChange}
              required
            />
          </div>
          <div>
            <label htmlFor="value">Value:</label>
            <input
              type="text"
              id="value"
              name="value"
              value={value}
              onChange={this.handleStorageChange}
              required
            />
          </div>
          <button type="submit">Set Custom Storage</button>
        </form>
      </div>
    );
  }
}

export default CustomStorage;
