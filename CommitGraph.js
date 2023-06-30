import React, { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { getCommits } from './api';

const CommitGraph = ({ username, repo }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getCommits(username, repo)
      .then((response) => {
        const commitData = response.data.map(commit => ({
          name: commit.sha.substring(0, 7),
          commits: 1
        }));

        setData(commitData);
      });
  }, [username, repo]);

  return (
    <LineChart width={800} height={400} data={data}>
      <Line type="monotone" dataKey="commits" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
    </LineChart>
  );
};

export default CommitGraph;
