import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const CommitGraph = ({ commits }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    const width = 800;
    const height = commits.length * 50;  // Set height depending on your data

    svg.attr("width", width).attr("height", height);

    const validCommitShas = new Set(commits.map(commit => commit.sha));

    const links = commits.flatMap((commit) => {
      return commit.parents
        .filter(parent => validCommitShas.has(parent.sha)) // Only include the link if the parent commit is in the data
        .map(parent => ({
          source: commit.sha,
          target: parent.sha,
        }));
    });
    
    

    const nodes = commits.map((commit, i) => {
      console.log(commit); // This will log the commit object to the console
      return {
        id: commit.sha,
        name: commit.message,
      };
    });
    

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => d.id))
      .force("charge", d3.forceManyBody().strength(-50))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line");

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 5)
      .attr("fill", "#69b3a2")
      .call(drag(simulation));

    node.append("title").text((d) => d.id);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });
  }, [commits]);

  return <svg ref={ref} />;
};

export default CommitGraph;

function drag(simulation) {
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}
