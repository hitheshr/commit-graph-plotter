import React, { useState, useEffect } from 'react';
import CommitContainer from './CommitContainer';
import { auth } from './firebase';
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { getLocalToken } from './gitgraph/getLocalToken';


const HomePage = () => {
  const [username, setUsername] = useState(null); // Set default username
  const [repo, setRepo] = useState(null); // Set default repo
  const [token, setToken] = useState(null);

  const [url, setUrl] = useState(''); // For storing the URL input by user
  

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

  const handleSubmit = (event) => {
    event.preventDefault();
    window.location.href = `/?url=${url}`; // Redirects the page to '/?url=<entered url>'
  };

  // Use useEffect hook to call signInWithGithub function when the page loads
  useEffect(() => {
    var currentUrl = window.location.href;
    var url = new URL(currentUrl);
    var _username = "";
    var _repo = "";
    try {
      var queryParamUrl = new URLSearchParams(url.search).get("url");
      var queryUrl = new URL(queryParamUrl);
      _username = queryUrl.pathname.split('/')[1];
      _repo = queryUrl.pathname.split('/')[2];
      console.log(_username, _repo);
    } catch(e) {
      console.error(e);
    }
    if (_username && _repo) {
      setUsername(_username);
      setRepo(_repo);
      signInWithGithub();
    }
    
    
  }, []);

  // Show a form when no username is provided
  if (!username) {
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            placeholder="Enter a github URL" 
            required 
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      {username && <CommitContainer username={username} repo={repo} token={token} />}
    </div>
  );
};

export default HomePage;
