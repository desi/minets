import React, { Component } from 'react';
import  './StorageBuilderHelper.css';

class StorageBuilderHelper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intInput: '',
      hexInput: '',
      formattedHexValue: '',
    };
  }

  handleIntInputChange = (event) => {
    this.setState({
      intInput: event.target.value,
    });
  };

  handleHexInputChange = (event) => {
    this.setState({
      hexInput: event.target.value,
    });
  };

  convertIntToHex = () => {
    const { intInput } = this.state;
    const hexValue = parseInt(intInput).toString(16);
    const paddedHex = hexValue.padStart(64, '0');
    this.setState({
      hexInput: hexValue,
      formattedHexValue: `0x${paddedHex}`,
    });
  };

  formatHex = () => {
    const { hexInput } = this.state;
    const paddedHex = hexInput.padStart(64, '0');
    this.setState({
      formattedHexValue: `0x${paddedHex}`,
    });
  };

  render() {
    const { intInput, hexInput, formattedHexValue } = this.state;

    return (
      <div className='StorageBuilderHelper'>
        <h2>Storage Builder Helper</h2>
        <div>
          <label htmlFor="intInput">Integer Input:</label>
          <input
            type="text"
            id="intInput"
            name="intInput"
            value={intInput}
            onChange={this.handleIntInputChange}
          />
          <button onClick={this.convertIntToHex}>Convert to Hex</button>
        </div>
        <div>
          <label htmlFor="hexInput">Hex Input:</label>
          <input
            type="text"
            id="hexInput"
            name="hexInput"
            value={hexInput}
            onChange={this.handleHexInputChange}
          />
          <button onClick={this.formatHex}>Format Hex</button>
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
        </div>
      </div>
    );
  }
}

export default StorageBuilderHelper;
