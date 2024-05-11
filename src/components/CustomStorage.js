import React, { Component } from "react";
import { exec } from "child_process";
import fs from "fs";
import ValueBuilderHelper from "./CustomStorageHelpers/ValueBuilderHelper";
import SlotBuilderHelper from "./CustomStorageHelpers/SlotBuilderHelper";
import { setCustomStorage } from "../anvil/network-configs/utils";
const { hexToString } = require('../anvil/network-configs/utils');
const { keccak256 } = require('@ethersproject/keccak256');
import StringEncoderDecoder from "./CustomStorageHelpers/StringEncoderDecoder";
import "./CustomStorage.css";

class CustomStorage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contractName: "",
      contractCode: "",
      svgContent: "",
      contractAddress: "",
      slot: "",
      value: "",
      storage: "",
      getContractAddress: "",
      storagePosition: "",
    };
    this.generateContractLayout = this.generateContractLayout.bind(this);
    this.handleLayoutChange = this.handleLayoutChange.bind(this);
    this.handleLayoutSubmit = this.handleLayoutSubmit.bind(this);
    this.handleStorageChange = this.handleStorageChange.bind(this);
    this.handleStorageSubmit = this.handleStorageSubmit.bind(this);
    // get storage
    this.getStorageAt = this.getStorageAt.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleGetStorageAt = this.handleGetStorageAt.bind(this);
  }

  generateContractLayout(contractCode, contractName) {
    const solFilePath = "./contract.sol"; // Provide the path to a temporary directory
    fs.writeFile(solFilePath, contractCode, (err) => {
      if (err) {
        console.error(`Error writing contract code to file: ${err}`);
        return;
      }
      exec(
        `sol2uml storage ${solFilePath} -c ${contractName}`,
        (error, stdout, stderr) => {
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
        }
      );
    });
  }

  readSVGFile(filePath) {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error(`Error reading SVG file: ${err}`);
        return;
      }
      this.setState({ svgContent: data });
    });
  }

  // Contract Storage Layout
  handleLayoutChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleLayoutSubmit(e) {
    e.preventDefault();
    const { contractCode, contractName } = this.state;
    this.generateContractLayout(contractCode, contractName);
  }

  // Set Contract Storage
  handleStorageChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  async handleStorageSubmit(e) {
    e.preventDefault();
    const { contractAddress, slot, value } = this.state;
    await setCustomStorage(this.props.anvil, contractAddress, slot, value);
    console.log("Submitting:", contractAddress, slot, value);
    // Clear form fields
    this.setState({ contractAddress: "", slot: "", value: "" });
  }


  // READ STORAGE SECTION
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
    const { getContractAddress, storagePosition } = this.state;
    await this.getStorageAt(getContractAddress, storagePosition);
  }

  render() {
    const {
      svgContent,
      contractAddress,
      slot,
      value,
      storage,
      getContractAddress,
    } = this.state;

    return (
      <div className="CustomStorage">
        <h1>Storage Laboratory</h1>
        <h2>Get the Contract Storage Layout</h2>
        <form className="storageLayout card" onSubmit={this.handleLayoutSubmit}>
          <label htmlFor="contractCode">Contract Code:</label>
          <textarea
            id="contractCode"
            name="contractCode"
            value={this.state.contractCode}
            onChange={this.handleLayoutChange}
          />
          <label htmlFor="contractName">Contract Name:</label>
          <textarea
            id="contractName"
            name="contractName"
            value={this.state.contractName}
            onChange={this.handleLayoutChange}
          />
          <button type="submit">Generate Layout</button>
        </form>
        <div className="svg">
          {svgContent && (
            <img
              src={`data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`}
              alt="Contract Layout"
              className="card"
            />
          )}
        </div>
        <hr />
        <h2>Construct your Storage values</h2>
        <div className="customStorageContainer">
          <SlotBuilderHelper />
          <ValueBuilderHelper />
        </div>
        <hr />

        <div className="card">
              <h2>Strings Helper</h2>
              <StringEncoderDecoder />
        </div>

        <div className="getSetStorageContainer">
          <div className="setStorage card">
            <h2>Set Contract Storage</h2>
            <form onSubmit={this.handleStorageSubmit}>
              <h3>Slot and Value</h3>
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
              <button type="submit">Set Storage</button>
            </form>
          </div>
          <div className="setStorage card">
            <h2>Get Storage At</h2>
            <form onSubmit={this.handleGetStorageAt}>
                <label htmlFor="getContractAddress">Contract Address:</label>
                <input
                  type="text"
                  id="getContractAddress"
                  name="getContractAddress"
                  value={this.state.getContractAddress}
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
              <h3 className="storageResult">Storage Result:</h3>
              <p className="storageResult">{storage}</p>
          </div>
          <hr />
        </div>
      </div>
    );
  }
}

export default CustomStorage;
