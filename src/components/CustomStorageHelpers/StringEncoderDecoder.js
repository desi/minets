import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import './StringEncoderDecoder.css';

class StringEncoderDecoder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hexValueEncode: '',
      hexValueDecode: '',
      decodedValue: '',
      stringValue: '',
      copyValue: '',
      copied: false,
    };
  }

  handleStringInputChange = (event) => {
    const stringValue = event.target.value;
    const hexValueEncode = this.encodeString(stringValue);
    this.setState({ stringValue, hexValueEncode });
  };

  handleHexDecodeInputChange = (event) => {
    const hexValueDecode = event.target.value;
    const decodedValue = this.decodeHexString(hexValueDecode);
    this.setState({ hexValueDecode, decodedValue });
  };

  encodeString = (stringValue) => {
    const utf8Encoder = new TextEncoder();
    const encodedBytes = utf8Encoder.encode(stringValue);
    const hexValue = encodedBytes.map(byte => byte.toString(16).padStart(2, '0')).join('');
    const lengthHex = encodedBytes.length.toString(16).padStart(4, '0'); // Convert length to hex and pad to 4 characters
    const paddedHexValue = hexValue.padEnd(64, '0'); // Pad the hex value with zeroes to reach 32 bytes
    return '0x' + paddedHexValue + lengthHex;
  };

  decodeHexString = (hexString) => {
    // Remove "0x" prefix if present
    hexString = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
    // Remove trailing zeros and length indicator
    const trimmedHexString = hexString.replace(/0+$/, '');
    // Convert hex string to bytes
    const bytes = trimmedHexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16));
    // Convert bytes to UTF-8 string
    const decodedString = new TextDecoder().decode(new Uint8Array(bytes));
    return decodedString;
  };

  handleCopyClick = (value) => {
    navigator.clipboard.writeText(value);
    this.setState({ copied: true });
    setTimeout(() => {
      this.setState({ copied: false });
    }, 5000);
  };

  render() {
    const {
      hexValueEncode,
      hexValueDecode,
      decodedValue,
      stringValue,
      copied,
    } = this.state;

    return (
      <div className='StringEncoderDecoder'>
        <p>Encode String</p>
        <input
          type="text"
          id="stringInput"
          name="stringInput"
          value={stringValue}
          onChange={this.handleStringInputChange}
          placeholder="Enter your string"
        />
        <p>Hex Value: {hexValueEncode}</p>
        <FontAwesomeIcon
            icon={faCopy}
            className="copy-icon"
            onClick={() => this.handleCopyClick(hexValueEncode)}
          />

        <p>Decode Hex String</p>
        <input
          type="text"
          id="hexDecodeInput"
          name="hexDecodeInput"
          value={hexValueDecode}
          onChange={this.handleHexDecodeInputChange}
          placeholder="Enter your hex value"
        />
        <p>Decoded Value: {decodedValue}</p>
        <FontAwesomeIcon
            icon={faCopy}
            className="copy-icon"
            onClick={() => this.handleCopyClick(decodedValue)}
          />
        {copied && <span className="copied-message">Value Copied!</span>}
    </div>
    );
  }
}

export default StringEncoderDecoder;
