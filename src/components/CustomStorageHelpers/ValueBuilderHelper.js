import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import  './ValueBuilderHelper.css';

class ValueBuilderHelper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intInput: '',
      hexInput: '',
      formattedHexValue: '',
      copied: false,
    };

    this.handleCopyClick = this.handleCopyClick.bind(this);
    this.handleIntInputChange = this.handleIntInputChange.bind(this);
    this.add18Decimals = this.add18Decimals.bind(this);

  }

  handleCopyClick = () => {
    const { formattedHexValue } = this.state;
    navigator.clipboard.writeText(formattedHexValue);
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
  };

  convertIntToHex = (intInput) => {
    const hexValue = parseInt(intInput).toString(16);
    return hexValue.padStart(64, '0');
  };

  add18Decimals = () => {
    this.setState((prevState) => {
      const intInput = prevState.intInput + '0'.repeat(18);
      const hexValue = this.convertIntToHex(intInput);
      return {
        intInput,
        hexInput: hexValue,
        formattedHexValue: this.formatHex(hexValue),
      };
    });
  };

  formatHex = (hexInput) => {
    return `0x${hexInput}`;
  };

  render() {
    const {
      intInput,
      hexInput,
      formattedHexValue,
      copied,
    } = this.state;

    return (
      <div className='ValueBuilderHelper'>
        <h2>Value Builder Helper</h2>
        <div>
          <label htmlFor="intInput">Integer Input:</label>
          <input
            type="text"
            id="intInput"
            name="intInput"
            value={intInput}
            onChange={this.handleIntInputChange}
          />
          <button onClick={this.add18Decimals}>Add 18 Decimals</button>
        </div>
        <div>
          <label htmlFor="hexInput">Hex Input:</label>
          <input
            type="text"
            id="hexInput"
            name="hexInput"
            value={hexInput}
            onChange={() => {}}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="formattedHexValue">Formatted Hex Value:</label>
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
      </div>
    );
  }
}


export default ValueBuilderHelper;
