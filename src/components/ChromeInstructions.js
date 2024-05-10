import React from "react";
import chromeImg from "../imgs/load-dev-build-chrome.gif";

import "./ERC721.css";

const ChromeInstructions = () => {
  return (
    <section className="chrome-instructions">
      <h2>Installing a development build in Chrome</h2>
      <div >
        <p>Follow these instructions to install a development build of MetaMask in Chrome:</p>
        <p>1. Click on the button above to pull the last merged commit's builds.</p>
        <p>2. Expand the "Builds ready" and download the build you would like.</p>
        <p>3. Open Chrome and navigate to <a href="chrome://extensions/">chrome://extensions/</a></p>
        <p>4. Enable Developer Mode by clicking the toggle in the top right corner</p>
        <p>5. Click "Load unpacked" and select the build you downloaded to your local machine (from above)</p>
        <p>6. MetaMask will now be installed in your browser</p>
        <p>7. If you have MetaMask already installed, you may need to disable the production extension to use the development extension</p>
        <img src={chromeImg} alt="chrome instructions" />
      </div>
    </section>
  );
};

export default ChromeInstructions;
