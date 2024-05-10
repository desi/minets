import React, { Component } from 'react';
import DOMPurify from 'dompurify';
import axios from "axios";
import './Builds.css';
import ChromeInstructions from './ChromeInstructions';


class Builds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pr: '',
      latestCommitSHA: '',
      buildsFetched: false,
      metamaskBotComment: '',
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
      this.setState({ buildsFetched: true });
    } catch (error) {
      console.error('Error fetching builds:', error);
  }};



  render() {
    const { pr,
      latestCommitSHA,
      buildsFetched,
      metamaskBotComment,
      chromeCustomBuildInstructions
    } = this.state;
    const safeMMBotHTML = DOMPurify.sanitize(metamaskBotComment);

    return (
      <section className="card">
        {!buildsFetched ? (
          <button className="btn-outline" onClick={this.getBuildsFromGithub}>
            Fetch Latest Builds
          </button>
        ) : (
          <div>
            <h2>Builds from the latest commit!</h2>
            <p>PR: {pr}</p>
            <p>Latest Commit: {latestCommitSHA}</p>
            <p><div dangerouslySetInnerHTML={{ __html: safeMMBotHTML }} /></p>
          </div>
        )}
        < ChromeInstructions />
      </section>
    );
  };
};

export default Builds;
