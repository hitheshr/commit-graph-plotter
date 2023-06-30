import axios from 'axios';

export const getUserRepos = (username) => {
  return axios.get(`https://api.github.com/users/${username}/repos`);
}

export const getCommits = (username, repo) => {
  return axios.get(`https://api.github.com/repos/${username}/${repo}/commits`);
}
