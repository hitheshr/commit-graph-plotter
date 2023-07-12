import React, { useEffect, useState } from 'react';
import { fetchGraphQL } from './api';
import CommitGraph from './CommitGraph';
import { fetchCommits } from './gitgraph/fetchCommits';

const CommitContainer = ({ username, repo, token }) => {

  useEffect(() => {
    if (username && repo && token) {
      var currentUrl = window.location.href;
      var splitUrl = currentUrl.split('/');
      var _username = splitUrl[4]
      var _repo = splitUrl[5];
      console.log(_username, _repo);
      fetchCommits(_username, _repo, token);
    }
  }, [username, repo, token]);

  return (
    <div className='main-content-container' style={{ width: '100%', height: '800px' }}>
      
    </div>
  );
};

export default CommitContainer;
