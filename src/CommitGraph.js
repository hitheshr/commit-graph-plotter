import React, { useEffect, useState } from 'react';
import { getCommits, getBranches } from './api';

const CommitGraph = ({ username, repo, token }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (username && repo && token) {
      getBranches(username, repo, token)
        .then((response) => {
          const branches = response.data;
          for (const branch of branches) {
            getCommits(username, repo, branch.name, token)
              .then((response) => {
                const commitData = response.data.map(commit => ({
                  name: commit.sha.substring(0, 7),
                  commits: 1
                }));

                setData(prevData => [...prevData, ...commitData]);
              });
          }
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
