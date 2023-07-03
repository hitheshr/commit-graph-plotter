import React, { useState } from 'react';
import CommitGraph from './CommitGraph';
// import firebase from 'firebase/app';
// import 'firebase/auth';
import { auth } from './firebase';
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";

const HomePage = () => {
  const [username, setUsername] = useState('');
  const [repo, setRepo] = useState('');
  const [submittedUsername, setSubmittedUsername] = useState('');
  const [submittedRepo, setSubmittedRepo] = useState('');

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setSubmittedUsername(username);
  //   setSubmittedRepo(repo);
  // }
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
      {token && <CommitGraph username={submittedUsername} repo={submittedRepo} token={token} />}
    </div>
  );
};

export default HomePage;
