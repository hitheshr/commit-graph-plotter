import React, { useEffect, useState } from 'react';
import { fetchGraphQL } from './api';
import CommitGraph from './CommitGraph';
import { fetchCommits } from './gitgraph/fetchCommits';

const CommitContainer = ({ username, repo, token }) => {

  useEffect(() => {
    if (username && repo && token) {
      fetchCommits(username, repo, token);
    }
  }, [username, repo, token]);

  return (
    <div className='main-content-container' style={{ width: '100%', height: '800px' }}>
      
    </div>
  );
};

export default CommitContainer;
