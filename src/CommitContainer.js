import React, { useEffect, useState } from 'react';
import { fetchGraphQL } from './api';
import CommitGraph from './CommitGraph';
import { fetchCommits } from './gitgraph/fetchCommits';

const CommitContainer = ({ username, repo, token }) => {

  useEffect(() => {
    if (username && repo && token) {
      var currentUrl = window.location.href;
      var url = new URL(currentUrl);
      try {
        var queryParamUrl = new URLSearchParams(url.search).get("url");
        var queryUrl = new URL(queryParamUrl);
        var _username = queryUrl.pathname.split('/')[1];
        var _repo = queryUrl.pathname.split('/')[2];
        console.log(_username, _repo);
        fetchCommits(_username, _repo, token);
      } catch(e) {
        console.error(e);
      }
    }
  }, [username, repo, token]);

  return (
    <div className='main-content-container' style={{ backgroundColor: 'black' }}>
    </div>
  );
};

export default CommitContainer;
