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
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Add a new state variable for authentication status


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
        setIsAuthenticated(true);
      }).catch((error) => {
        console.error(error);
        // handle error
        setIsAuthenticated(false);
      });
    } else {
      setToken(localToken);
      setIsAuthenticated(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    window.location.href = `/commit-graph-plotter/?url=${url}`; // Redirects the page to '/?url=<entered url>'
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

    const checkAuthentication = async () => {
      var localToken = getLocalToken();
      const isValidToken = await checkTokenValidity(localToken);

      if (isValidToken) {
        setToken(localToken);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    if (_username && _repo) {
      setUsername(_username);
      setRepo(_repo);
      checkAuthentication();
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

  if (isAuthenticated === false) {
    return (
      <button onClick={signInWithGithub}>Authenticate with Github</button>
    );
  }

  return (
    <div>
      {username && <CommitContainer username={username} repo={repo} token={token} />}
    </div>
  );
};

export default HomePage;
