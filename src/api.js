import axios from 'axios';

export const getUserRepos = (username) => {
  return axios.get(`https://api.github.com/users/${username}/repos`);
}

// export const getCommits = (username, repo) => {
//   return axios.get(`https://api.github.com/repos/${username}/${repo}/commits`);
// }

export const getBranches = (username, repo, token) => {
  return axios.get(`https://api.github.com/repos/${username}/${repo}/branches`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

export const getCommits = (username, repo, branch, token) => {
  return axios.get(`https://api.github.com/repos/${username}/${repo}/commits?sha=${branch}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}
