import React, { useState, useEffect } from "react";

const Commit = ({ oid, messageHeadlineHTML, authorLogin, committedDate, color }) => (
  <div style={{ color }}>
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ width: '10px', height: '10px', backgroundColor: color, borderRadius: '50%', marginRight: '10px' }}></span>
      <p dangerouslySetInnerHTML={{ __html: messageHeadlineHTML }}></p>
    </div>
    <p>{authorLogin}</p>
    <p>{committedDate}</p>
    <p>{oid}</p>
  </div>
);

const CommitGraph = ({ commits, heads }) => {
  const [commitDict, setCommitDict] = useState({});

  const colors = ["#fd7f6f", "#beb9db", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#ffee65", "#fdcce5", "#8bd3c7"];
  let unassignedColors = [...colors];

  useEffect(() => {
    const newCommitDict = {};
    let commitIndex = 0;

    for (let commit of commits) {
      commit.color = undefined;
      newCommitDict[commit.oid] = commit;
    }

    for (let commit of commits) {
      let commitsha = commit.oid;
      commit = newCommitDict[commitsha];

      if (commit.parents.length > 1) {  // The commit is a merge commit.
        commit.color = unassignedColors[commitIndex % unassignedColors.length];
        unassignedColors = unassignedColors.filter((color) => color !== commit.color);

        if (unassignedColors.length === 0) {
          unassignedColors = [...colors];
        }
        commit.lineIndex = commitIndex;
      }

      commitIndex += 1;

      if (commit.parents.length > 0) {
        if (commit.parents[0].node && commit.parents[0].node.oid in newCommitDict && newCommitDict[commit.parents[0].node.oid].color == null) {
          newCommitDict[commit.parents[0].node.oid].color = commit.color;
          newCommitDict[commit.parents[0].node.oid].lineIndex = commit.lineIndex;
        }
      }
    }

    setCommitDict(newCommitDict);
  }, [commits, heads]);

  return (
    <div>
      {commits.map((commit) => {
        const { oid, ...otherProps } = commit;
        return <Commit key={oid} oid={oid} color={commitDict[oid]?.color || "black"} {...otherProps} />
      })}
    </div>
  );
};

export default CommitGraph;
