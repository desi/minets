import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

import "./SlotBuilderHelper.css";

class SlotBuilderHelper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intInput: "",
      hexInput: "",
      formattedHexValue: "",
      keyInput: "",
      keyPaddedValue: "",
      concatenatedValue: "",
      copied: false,
      copiedConcatenated: false,
    };

    this.handleCopyClick = this.handleCopyClick.bind(this);
    this.handleIntInputChange = this.handleIntInputChange.bind(this);
    this.handleKeyInputChange = this.handleKeyInputChange.bind(this);
    this.add18Decimals = this.add18Decimals.bind(this);
  }

  handleCopyClick = () => {
    const { concatenatedValue } = this.state;
    navigator.clipboard.writeText(concatenatedValue);
    this.setState({ copied: true });
  };

  handleIntInputChange = (event) => {
    const intInput = event.target.value;
    const hexValue = this.convertIntToHex(intInput);
    this.setState({
      intInput,
      hexInput: hexValue,
      formattedHexValue: this.formatHex(hexValue),
    });
    this.updateConcatenatedValue(hexValue);
  };

  handleKeyInputChange = (event) => {
    const keyInput = event.target.value.replace(/^0x/, '');
    const keyPaddedValue = this.padKey(keyInput);
    this.setState({ keyInput, keyPaddedValue });
    this.updateConcatenatedValue(this.state.hexInput, keyPaddedValue); 
  };

  updateConcatenatedValue = (hexInput, keyPaddedValue) => {
    const concatenatedValue = keyPaddedValue + hexInput;
   this.setState({ concatenatedValue });
  };

  convertIntToHex = (intInput) => {
    const hexValue = parseInt(intInput).toString(16);
    return hexValue.padStart(64, "0");
  };

  add18Decimals = () => {
    this.setState((prevState) => {
      const intInput = prevState.intInput + "0".repeat(18);
      const hexValue = this.convertIntToHex(intInput);
      return {
        intInput,
        hexInput: hexValue,
        formattedHexValue: this.formatHex(hexValue),
      };
    });
    this.updateConcatenatedValue(this.state.hexInput);
  };

  formatHex = (hexInput) => {
    return `0x${hexInput}`;
  };

  padKey = (keyInput) => {
    const expectedLength = 64;
    const keyWithoutPrefix = keyInput.startsWith("0x") ? keyInput.slice(2) : keyInput;
    const paddingLength = Math.max(0, expectedLength - keyWithoutPrefix.length);
    return `${"0".repeat(paddingLength)}${keyWithoutPrefix}`;
  };

  handleCopyConcatenatedClick = () => {
    const { concatenatedValue } = this.state;
    navigator.clipboard.writeText(concatenatedValue);
    this.setState({ copiedConcatenated: true });
  };

  render() {
    const {
      intInput,
      hexInput,
      formattedHexValue,
      keyInput,
      keyPaddedValue,
      copied,
      copiedConcatenated
    } = this.state;

    return (
      <div className="SlotBuilderHelper card">
        <h3>Slot Builder Helper</h3>
        <div>
          <label htmlFor="intInput">Slot Value:</label>
          <input
            type="text"
            id="intInput"
            name="intInput"
            value={intInput}
            onChange={this.handleIntInputChange}
          />
        </div>
        <div>
          <label htmlFor="hexInput">Slot Value Padded:</label>
          <input
            type="text"
            id="hexInput"
            name="hexInput"
            value={hexInput}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="formattedHexValue">Formatted Slot Value:</label>
          <input
            type="text"
            id="formattedHexValue"
            name="formattedHexValue"
            value={formattedHexValue}
            readOnly
          />
          <FontAwesomeIcon
            icon={faCopy}
            className="copy-icon"
            onClick={this.handleCopyClick}
          />
          {copied && <span className="copied-message">Value Copied!</span>}
        </div>
        <hr />
        <div>
          <h2>Slot and Key</h2>
          <div>
            <label htmlFor="keyInput">Key:</label>
            <input
              type="text"
              id="keyInput"
              name="keyInput"
              value={keyInput}
              onChange={this.handleKeyInputChange}
            />
          </div>
          <div>
            <label htmlFor="keyPaddedValue">Key Value Padded:</label>
            <p id="keyPaddedValue">{keyPaddedValue}</p>
          </div>
          <div>
            <h2>Formatted Slot and Key Value:</h2>

            <div>
          <label htmlFor="formattedSlotAndKeyValue">Formatted Slot and Key Value:</label>
          <input
            type="text"
            id="formattedSlotAndKeyValue"
            name="formattedSlotAndKeyValue"
            value={this.state.concatenatedValue}
            readOnly
          />
          <FontAwesomeIcon
            icon={faCopy}
            className="copy-icon"
            onClick={this.handleCopyConcatenatedClick} // Add onClick event handler
          />
          {copiedConcatenated && <span className="copied-message">Value Copied!</span>}
          </div>
        </div>
      </div>
    </div>
    );
  }
}


export default SlotBuilderHelper;
