import React, { useEffect, useState } from 'react';
import { getBranches, getCommits } from './api';
import CommitGraph from './CommitGraph'; // Make sure this points to the correct location

const CommitContainer = ({ username, repo, token }) => {
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
                  sha: commit.sha,
                  parents: commit.parents.map(parent => ({ sha: parent.sha })),
                  message: commit.commit.message
                }));

                setData(prevData => [...prevData, ...commitData]);
              });
          }
        });
    }
  }, [username, repo, token]);

  return (
    <div style={{ width: '100%', height: '800px' }}>
      {data.length > 0 && (
        <CommitGraph commits={data} />
      )}
    </div>
  );
};

export default CommitContainer;
