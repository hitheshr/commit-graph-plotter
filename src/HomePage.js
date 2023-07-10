import React, { useState } from 'react';
import CommitContainer from './CommitContainer';
import { auth } from './firebase';
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";

const HomePage = () => {
  const [username, setUsername] = useState('opencv'); // Set default username
  const [repo, setRepo] = useState('opencv'); // Set default repo
  const [submittedUsername, setSubmittedUsername] = useState('');
  const [submittedRepo, setSubmittedRepo] = useState('');

  const [token, setToken] = useState(null);

  const signInWithGithub = () => {
    const provider = new GithubAuthProvider();
    provider.addScope('repo');
    signInWithPopup(auth, provider).then((result) => {
      console.log(result);
      setToken(result._tokenResponse.oauthAccessToken);
    }).catch((error) => {
      console.error(error);
      // handle error
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedUsername(username);
    setSubmittedRepo(repo);
    signInWithGithub();
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="GitHub username" />
        <input value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="GitHub repository" />
        <button type="submit">Sign in with GitHub and Submit</button>
      </form>
      {token && <CommitContainer username={submittedUsername} repo={submittedRepo} token={token} />}
    </div>
  );
};

export default HomePage;
