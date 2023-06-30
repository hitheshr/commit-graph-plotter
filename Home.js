import React, { useState } from 'react';
import CommitGraph from './CommitGraph';

const HomePage = () => {
  const [username, setUsername] = useState('');
  const [repo, setRepo] = useState('');

  return (
    <div>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="GitHub username" />
      <input value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="GitHub repository" />
      <CommitGraph username={username} repo={repo} />
    </div>
  );
};

export default HomePage;
