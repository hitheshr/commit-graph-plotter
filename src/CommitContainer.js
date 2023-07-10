import React, { useEffect, useState } from 'react';
import { fetchGraphQL } from './api';
import CommitGraph from './CommitGraph';

const CommitContainer = ({ username, repo, token }) => {
  const [commits, setCommits] = useState([]);
  const [heads, setHeads] = useState([]);

  useEffect(() => {
    if (username && repo && token) {
      const branchesQuery = `
        {
          repository(owner: "${username}", name: "${repo}") {
            refs(refPrefix: "refs/heads/", first: 100) {
              edges {
                node {
                  name
                  target {
                    oid
                  }
                }
              }
            }
          }
        }
      `;

      fetchGraphQL(branchesQuery, {}, token)
        .then((response) => {
          const branches = response.repository.refs.edges.map(edge => ({
            name: edge.node.name,
            oid: edge.node.target.oid,
          }));
          setHeads(branches); // store branch head information
          let allCommits = [];
          for (const branch of branches) {
            const commitsQuery = `
            {
              repository(owner: "${username}", name: "${repo}") {
                ref(qualifiedName: "${branch.name}") {
                  target {
                    ... on Commit {
                      history(first: 100) {
                        edges {
                          node {
                            oid
                            messageHeadline
                            messageHeadlineHTML
                            committedDate
                            author {
                              avatarUrl
                              email
                            }
                            parents(first: 1) {
                              nodes {
                                oid
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            `;


            fetchGraphQL(commitsQuery, {}, token)
              .then((response) => {
                const commitData = response.repository.ref.target.history.edges.map(edge => ({
                  oid: edge.node.oid,
                  messageHeadlineHTML: edge.node.messageHeadlineHTML,
                  committedDate: edge.node.committedDate,
                  authorLogin: edge.node.author.login,
                  authorAvatar: edge.node.author.avatarUrl,
                  parents: edge.node.parents.nodes,
                }));
                allCommits = [...allCommits, ...commitData];

                if (branch === branches[branches.length - 1]) {
                  allCommits.sort((a, b) => new Date(b.committedDate) - new Date(a.committedDate));
                  setCommits(allCommits);
                }
              });
          }
        });
    }
  }, [username, repo, token]);

  return (
    <div style={{ width: '100%', height: '800px' }}>
      {commits.length > 0 && heads.length > 0 && (
        <CommitGraph commits={commits} heads={heads} />
      )}
    </div>
  );
};

export default CommitContainer;
