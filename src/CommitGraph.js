import React, { useEffect, useState } from 'react';
import { getCommits } from './api';

// const CommitGraph = ({ username, repo }) => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     if (username && repo) {
//       getCommits(username, repo)
//         .then((response) => {
//           const commitData = response.data.map(commit => ({
//             name: commit.sha.substring(0, 7),
//             commits: 1
//           }));

//           setData(commitData);
//         });
//     }
//   }, [username, repo]);
const CommitGraph = ({ username, repo, token }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (username && repo && token) {
      getCommits(username, repo, token)
        .then((response) => {
          const commitData = response.data.map(commit => ({
            name: commit.sha.substring(0, 7),
            commits: 1
          }));

          setData(commitData);
        });
    }
  }, [username, repo, token]);

  return (
    <div>
      {data.map(commit => (
        <div key={commit.name}>
          <span>{commit.name}: </span>
          <span>{commit.commits}</span>
        </div>
      ))}
    </div>

  );
};

export default CommitGraph;
