import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import axios from "axios";
import './Builds.css';
import Markdown from 'react-markdown'


class Builds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pr: '',
      latestCommitSHA: '',
      buildsFetched: false,
      metamaskBotComment: '',
      chromeCustomBuildInstructions: '',
      firefoxCustomBuildInstructions: '',
    };
    this.getBuildsFromGithub = this.getBuildsFromGithub.bind(this);
  }

  getBuildsFromGithub = async () => {
    let lastCommit;
    let pr;
    var queryString = '';
    var commentsURL = '';
    try {
      await axios
      .get(
        "https://api.github.com/repos/MetaMask/metamask-extension/commits/develop"
      )
      .then((lastCommit) => {
        this.setState({ latestCommitSHA: lastCommit.data.sha });
        queryString = 'q=' + encodeURIComponent('is:pull-request is:merged sha:') + lastCommit.data.sha
      });
      var searchURL = "https://api.github.com/search/issues?" + queryString
      
      await axios.get(searchURL).then((pr) => {
        this.setState({ pr: pr.data.items[0].number });
       // commentsURL = "https://api.github.com/repos/Metamask/metamask-extension/issues/" + pr.data.items[0].number + "/comments"
      //TODO: remove hardcoded PR number - when metamaskbot hasn't commented yet we get an error. Need to handle
       commentsURL = "https://api.github.com/repos/Metamask/metamask-extension/issues/" + 24283 + "/comments"
      });

      await axios.get(commentsURL).then((comments) => {
        const metamaskBotComment = comments.data.find(comment => comment.user.login === 'metamaskbot');
        this.setState({ metamaskBotComment: metamaskBotComment.body });
      });
      await this.getCustomBuildInstructions();
      this.setState({ buildsFetched: true });
    } catch (error) {
      console.error('Error fetching builds:', error);
  }};

  getCustomBuildInstructions = async () => {
    //TODO: consider just building the instructions into the app and don't pull the instructions from github
      const url = 'https://raw.githubusercontent.com/MetaMask/metamask-extension/develop/docs/add-to-chrome.md';
      await axios.get(url)
      .then((response) => {
        this.setState({ chromeCustomBuildInstructions: response.data });
      });
  };

  render() {
    const { pr,
      latestCommitSHA,
      buildsFetched,
      metamaskBotComment,
      chromeCustomBuildInstructions
    } = this.state;
    const safeMMBotHTML = DOMPurify.sanitize(metamaskBotComment);

    return (
      <div className="Builds">
        {!buildsFetched ? (
          <button className="builds-btn" onClick={this.getBuildsFromGithub}>
            Fetch Builds
          </button>
        ) : (
          <div>
            <p>PR: {pr}</p>
            <p>Latest Commit: {latestCommitSHA}</p>
            <p><div dangerouslySetInnerHTML={{ __html: safeMMBotHTML }} /></p>

            <p>INSTRUCTIONS FOR IMPORTING INTO METAMASK</p> 
            <p><Markdown>{chromeCustomBuildInstructions}</Markdown></p>
          </div>
          )
        }
      </div>
    );
  };
};

export default Builds;
