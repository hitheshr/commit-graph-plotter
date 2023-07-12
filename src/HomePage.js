import React, { useState } from 'react';
import CommitContainer from './CommitContainer';
import { auth } from './firebase';
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { getLocalToken } from './gitgraph/getLocalToken';

const HomePage = () => {
  const [username, setUsername] = useState('opencv'); // Set default username
  const [repo, setRepo] = useState('opencv'); // Set default repo
  const [submittedUsername, setSubmittedUsername] = useState('');
  const [submittedRepo, setSubmittedRepo] = useState('');

  const [token, setToken] = useState(null);

  const checkTokenValidity = async (token) => {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      if (response.status === 200) {
        // The token is valid
        return true;
      } else {
        // The token is not valid
        return false;
      }
    } catch (error) {
      // Handle error
    }
  };

  const signInWithGithub = async () => {
    var localToken = getLocalToken();
    const isValidToken = await checkTokenValidity(localToken);
    
    if (!isValidToken) {
      const provider = new GithubAuthProvider();
      provider.addScope('repo');
      signInWithPopup(auth, provider).then((result) => {
        console.log(result);
        setToken(result._tokenResponse.oauthAccessToken);
      }).catch((error) => {
        console.error(error);
        // handle error
      });
    }else{
      setToken(localToken);
    }
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
        <button type="submit">See graph</button>
      </form>
      {token && <CommitContainer username={submittedUsername} repo={submittedRepo} token={token} />}
    </div>
  );
};

export default HomePage;
