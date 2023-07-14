import { drawGraph } from "./drawGraph";
import { fetchFurther } from "./fetchFurther";
import { getLocalToken } from "./getLocalToken";
import { loadBranchesButton } from "./loadBranchesButton";
import { setBranchOptions } from "./setBranchOptions";
function assignColors(commits, heads) {
  var headOids = new Set();
  for (var head of heads) {
    headOids.add(head.oid);
  }
  var commitDict = {}
  for (var commit of commits) {
    commit.color = undefined;
    commitDict[commit.oid] = commit
  }

  // Keep assigning from unassignedColors.
  // Whenever a color is assigned, remove it from unassignedColors
  // When unassignedColors become empty, copy colors to unassignedColors
  const colors = ["#fd7f6f", "#beb9db", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#ffee65", "#fdcce5", "#8bd3c7"]
  var unassignedColors = colors;

  var commitIndex = 0;
  // For each commit, assign a colour
  // If the commit has a parent, assign the same colour to the parent
  // If the commit has no parent or if commit is a head, assign a random colour
  // If the commit has two parents, assign the original colour to first parent (merge target branch)
  // and a random colour to the second parent (merge source branch)
  for (var commit of commits) {
    var commitsha = commit.oid
    commit = commitDict[commitsha];
    if (commit.color == null | headOids.has(commitsha)) {
      commit.color = unassignedColors[commitIndex % unassignedColors.length];
      unassignedColors = unassignedColors.filter(function (color) {
        return color != commit.color;
      });
      if (unassignedColors.length == 0) {
        unassignedColors = colors;
      }
      commit.lineIndex = commitIndex;
    }
    commitIndex += 1;
    if (commit.parents.length > 0) {
      if (commit.parents[0].node.oid in commitDict && commitDict[commit.parents[0].node.oid].color == null) {
        commitDict[commit.parents[0].node.oid].color = commit.color;
        commitDict[commit.parents[0].node.oid].lineIndex = commit.lineIndex;
      }
    }
  }
  return ([commits, commitDict]);
}


// Get the required commit details from api
// commits parameter contains the commit shas
async function getCommitDetails(repoOwner, repoName, commits, allCommits) {
  var queryBeginning = `
    query { 
        rateLimit {
            limit
            cost
            remaining
            resetAt
          }
        repository(owner:"`+ repoOwner + `", name: "` + repoName + `") {`;
  var queryContent = queryBeginning;
  for (var i = Math.max(0, commits.length - 11); i < commits.length; i++) {
    queryContent += `
        commit`+ i + `: object(oid: "` + commits[i].oid + `") {
            ... on Commit{
                additions
                deletions
                parents(first:100) {
                    edges {
                      node {
                        ... on Commit{
                          oid
                        }
                      }
                    }
                  }
                author{
                  name
                  user{
                    login
                    avatarUrl
                  }
                }
              }
            }`;
  }
  queryContent += ` } } `;
  var endpoint = "https://api.github.com/graphql";
  var headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + getLocalToken()
  };
  var body = {
    query: queryContent
  };
  var response = await fetch(endpoint, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  });
  if ((response.status != 200 && response.status != 201)) {
    console.log("--ERROR FETCHING GRAPHQL--");
    // addAuthorizationPrompt("Failed to fetch commits. Make sure your GitHub account has access to the repository.");
    return (false);
  }
  var data = await response.json();
  console.log(data);
  if (data.error) {
    console.log("--ERROR FETCHING GRAPHQL--");
    // addAuthorizationPrompt("Failed to fetch commits. Make sure your GitHub account has access to the repository.");
    return (false);
  }
  var commitDetails = data.data.repository;
  for (var i = 0; i < commits.length; i++) {
    if (commitDetails['commit' + i] == undefined) {
      continue;
    }
    commits[i].additions = commitDetails['commit' + i].additions;
    commits[i].deletions = commitDetails['commit' + i].deletions;
    commits[i].author = commitDetails['commit' + i].author.name;
    if (commitDetails['commit' + i].author.user != null) {
      commits[i].authorAvatar = commitDetails['commit' + i].author.user.avatarUrl;
      commits[i].authorLogin = commitDetails['commit' + i].author.user.login;
      commits[i].hasUserData = true;
    }
    else {
      commits[i].authorAvatar = "";
      commits[i].authorLogin = commitDetails['commit' + i].author.name;
      commits[i].hasUserData = false;
    }
    commits[i].parents = commitDetails['commit' + i].parents.edges;
  }
  for (var commit of commits) {
    for (var target of allCommits) {
      if (commit.oid == target.oid) {
        target.author = commit.author;
        target.authorAvatar = commit.authorAvatar;
        target.authorLogin = commit.authorLogin;
        target.hasUserData = commit.hasUserData;
        target.parents = commit.parents;
      }
    }
  }
  return ([commits, allCommits]);
}

export async function showCommits(commits, branchNames, allCommits, heads, pageNo, repoOwner, repoName) {
  // var presentUrl = window.location.href;
  // var repoOwner = presentUrl.split('/')[3];
  // var repoName = presentUrl.split('/')[4];
  [commits, allCommits] = await getCommitDetails(repoOwner, repoName, commits, allCommits);
  var contentView = document.getElementsByClassName("main-content-container")[0];

  var commitsContainerDummy = document.createElement("div");

  var commitsOutsideContainer;
  var commitsContainer;

  // var commitsLoadingHtml = chrome.runtime.getURL('html/commitsContainer.html');
  // var commitsGraphContainer;

  var commitDict;
  [commits, commitDict] = assignColors(commits, heads);

  var commitsContainerHtml = `
  <div class="" id="commits-outside-container">
    <ol class="mt-3 list-style-none Box Box--condensed ml-n6 ml-sm-0 mb-5 position-relative" id="commitsOl">
        <div style="width:100%">
            <div style="float: left;">
                <svg width="100" id="graphSvg" style="height: 500; display: block; transform: scale(-1,1)">
                </svg>
            </div>
            <div style="float: none; overflow: hidden;" id="commits-container">
            </div>
        </div>
    </ol>
    <div class="paginate-container" data-pjax="" data-html-cleaner-suppress-children="">
        <div class="BtnGroup" data-test-selector="pagination">
            <a rel="nofollow" class="btn btn-primary BtnGroup-item" aria-disabled="true" id="olderButton">
                Load More
            </a>
        </div>
    </div>
    <div id = "hoverCardContainer">
    </div>
  </div>
  `;
  
  // await fetch(commitsLoadingHtml).then(response => response.text()).then(commitsContainerHtmlText => {
  //   var tempDiv = document.createElement('div');
  //   tempDiv.innerHTML = commitsContainerHtmlText;
  //   commitsOutsideContainer = tempDiv.querySelector("#commits-outside-container");
  //   commitsContainer = tempDiv.querySelector("#commits-container");
  // });

  var tempDiv = document.createElement('div');
  tempDiv.innerHTML = commitsContainerHtml;
  commitsOutsideContainer = tempDiv.querySelector("#commits-outside-container");
  commitsContainer = tempDiv.querySelector("#commits-container");

  // var commitItemHtml = chrome.runtime.getURL('html/commitItem.html');
  // await fetch(commitItemHtml).then(response => response.text()).then(commitItemHtmlText => {
  //   var tempDiv = document.createElement('div');
  //   tempDiv.innerHTML = commitItemHtmlText;
  //   var commitItem = tempDiv.firstChild;

  //   for (var commit of commits) {
  //     var newCommitItem = commitItem.cloneNode(true);
  //     newCommitItem.setAttribute("data-url", "/" + repoOwner + "/" + repoName + "/commits/" + commit.oid + "/commits_list_item");
  //     newCommitItem.setAttribute("commitSha", commit.oid);
  //     var parents = []
  //     for (var parent of commit.parents) {
  //       parents.push(parent.node.oid.substring(0, 7));
  //     }
  //     newCommitItem.querySelector("#commitMessage").innerHTML = commit.messageHeadlineHTML;
  //     newCommitItem.querySelector("#commitMessage").setAttribute("href", "/" + repoOwner + "/" + repoName + "/commit/" + commit.oid);
  //     newCommitItem.querySelector("#avatarBody").setAttribute("aria-label", commit.authorLogin);
  //     newCommitItem.querySelector("#hoverCard").setAttribute("data-hovercard-url", "/users/" + commit.authorLogin + "/hovercard");
  //     newCommitItem.querySelector("#hoverCard").setAttribute("href", "/" + commit.authorLogin);
  //     newCommitItem.querySelector("#avatarImage").setAttribute("alt", "@" + commit.authorLogin);
  //     newCommitItem.querySelector("#copyFullSHA").setAttribute("value", commit.oid);
  //     newCommitItem.querySelector("#commitLink").setAttribute("href", "/" + repoOwner + "/" + repoName + "/commit/" + commit.oid);
  //     newCommitItem.querySelector("#commitTreeLink").setAttribute("href", "/" + repoOwner + "/" + repoName + "/tree/" + commit.oid);
  //     newCommitItem.querySelector("#commitLink").innerHTML = commit.oid.substring(0, 7);
  //     newCommitItem.querySelector("#statusDetails").setAttribute("data-deferred-details-content-url", "/" + repoOwner + "/" + repoName + "/commit/" + commit.oid + "/status-details");
  //     newCommitItem.querySelector("#viewAllCommits").innerHTML = commit.authorLogin;
  //     newCommitItem.querySelector("#relativeTime").innerText = relativeTime(commit.committedDate);
  //     if (commit.hasUserData) {
  //       newCommitItem.querySelector("#avatarImage").setAttribute("src", commit.authorAvatar + "&s=40");
  //       newCommitItem.querySelector("#viewAllCommits").setAttribute("title", "View all commits by " + commit.authorLogin);
  //       newCommitItem.querySelector("#viewAllCommits").setAttribute("href", "/" + repoOwner + "/" + repoName + "/commits?author=" + commit.authorLogin);
  //     }
  //     commitsContainerDummy.appendChild(newCommitItem);
  //   }
  // });

  var commitItemHtml = `
  <li style="padding: 10px; border: 1px solid #ccc; background-color: whitesmoke; color: #333; display: flex; font-size: 14px; font-weight: bold; margin-top: 0;">
      <div >
          <span>
              <a href="" target="_blank" rel="noopener noreferrer" aria-label="View commit details" id="commitLink"> ....</a>
              <button id="copyBtn" data-clipboard-text="3155d88b8b15d1f7ddb9030d174991d862dbaf38"
                  aria-label="Copy the full SHA" type="button" data-view-component="true"
                  class="tooltipped tooltipped-sw btn-outline btn BtnGroup-item px-0">
                  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"
                      data-view-component="true" class="octicon octicon-copy">
                      <path fill-rule="evenodd"
                          d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path>
                      <path fill-rule="evenodd"
                          d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path>
                  </svg>
              </button>
              <a href="" target="_blank" rel="noopener noreferrer" aria-label="Browse the repository at this point in the history" data-view-component="true"
                  class="tooltipped tooltipped-sw btn-outline btn BtnGroup-item" id="commitTreeLink"> <svg
                      aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"
                      data-view-component="true" class="octicon octicon-code">
                      <path fill-rule="evenodd"
                          d="M4.72 3.22a.75.75 0 011.06 1.06L2.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L.47 8.53a.75.75 0 010-1.06l4.25-4.25zm6.56 0a.75.75 0 10-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 101.06 1.06l4.25-4.25a.75.75 0 000-1.06l-4.25-4.25z">
                      </path>
                  </svg>

              </a>
              <a href="" target="_blank" rel="noopener noreferrer" aria-label="branch details" id="headBranchName"> </a>
              <span id="commitMessage" target="_blank" rel="noopener noreferrer" >Loading...</span>
              <img data-test-selector="commits-avatar-stack-avatar-image" width="20" height="20" alt=""
                              class=" avatar-user" id="avatarImage"
                              src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=">
              <a class="commit-author user-mention" title="View all commits by ..." id="viewAllCommits">Loading</a>

              committed
              <relativetime id="relativeTime" datetime="2022-07-26T17:08:20Z" class="no-wrap"
                  title="26 Jul 2022, 22:38 GMT+5:30">...
                  days ago</relativetime>
          </span>
          <div class="d-flex flex-items-center mt-1">

              <div class="AvatarStack flex-self-start  ">
                  <div class="AvatarStack-body" id="avatarBody" aria-label="">
                      <a class="avatar avatar-user" style="width:1px;height:1px;" data-skip-pjax="true"
                          data-test-selector="commits-avatar-stack-avatar-link" data-hovercard-type="user" id="hoverCard"
                          data-hovercard-url="" data-octo-click="hovercard-link-click"
                          data-octo-dimensions="link_type:self" href="" target="_blank" rel="noopener noreferrer" >
                      </a>
                  </div>
              </div>

              <div class="f6 color-fg-muted min-width-0">
                  

              </div>
          </div>
      </div>
  </li>
  `;


  var tempDiv = document.createElement("div");
  tempDiv.innerHTML = commitItemHtml.trim();
  var commitItem = tempDiv.firstElementChild;

  var headOids = new Set();
  for (var head of heads) {
    headOids.add(head.oid);
  }

  for (var commit of commits) {
    var newCommitItem = commitItem.cloneNode(true);
    if (headOids.has(commit.oid)) {
      // get branch name
      var branchName = "";
      for (var head of heads) {
        if (head.oid == commit.oid) {
          branchName = head.name;
          console.log("branchName: " + branchName);
          newCommitItem.querySelector("#headBranchName").innerHTML = branchName;
          newCommitItem.querySelector("#headBranchName").setAttribute("href", "https://github.com/" + repoOwner + "/" + repoName + "/tree/" + branchName);
          break;
        }
      }
    }

    newCommitItem.setAttribute("data-url", "https://github.com/" + repoOwner + "/" + repoName + "/commits/" + commit.oid + "/commits_list_item");
    newCommitItem.setAttribute("commitSha", commit.oid);
    var parents = []
    for (var parent of commit.parents) {
      parents.push(parent.node.oid.substring(0, 7));
    }
    newCommitItem.querySelector("#commitMessage").innerHTML = commit.messageHeadlineHTML;
    // newCommitItem.querySelector("#commitMessage").setAttribute("href", "https://github.com/" + repoOwner + "/" + repoName + "/commit/" + commit.oid);
    newCommitItem.querySelector("#avatarBody").setAttribute("aria-label", commit.authorLogin);
    newCommitItem.querySelector("#hoverCard").setAttribute("data-hovercard-url", "/users/" + commit.authorLogin + "/hovercard");
    newCommitItem.querySelector("#hoverCard").setAttribute("href", "https://github.com/" + commit.authorLogin);
    newCommitItem.querySelector("#avatarImage").setAttribute("alt", "@" + commit.authorLogin);
    // newCommitItem.querySelector("#copyFullSHA").setAttribute("value", commit.oid);
    newCommitItem.querySelector("#commitLink").setAttribute("href", "https://github.com/" + repoOwner + "/" + repoName + "/commit/" + commit.oid);
    newCommitItem.querySelector("#commitTreeLink").setAttribute("href", "https://github.com/" + repoOwner + "/" + repoName + "/tree/" + commit.oid);
    newCommitItem.querySelector("#commitLink").innerHTML = commit.oid.substring(0, 7);
    // newCommitItem.querySelector("#statusDetails").setAttribute("data-deferred-details-content-url", "github.com/" + repoOwner + "/" + repoName + "/commit/" + commit.oid + "/status-details");
    newCommitItem.querySelector("#viewAllCommits").innerHTML = commit.authorLogin;
    newCommitItem.querySelector("#relativeTime").innerText = relativeTime(commit.committedDate);
    if (commit.hasUserData) {
      newCommitItem.querySelector("#avatarImage").setAttribute("src", commit.authorAvatar + "&s=40");
      newCommitItem.querySelector("#viewAllCommits").setAttribute("title", "View all commits by " + commit.authorLogin);
      newCommitItem.querySelector("#viewAllCommits").setAttribute("href", "https://github.com/" + repoOwner + "/" + repoName + "/commits?author=" + commit.authorLogin);
    }
    var copyButton = newCommitItem.querySelector("#copyBtn");
    copyButton.setAttribute("data-clipboard-text", commit.oid);
    copyButton.removeAttribute("id");
    // Add the event listener to the copy button
    copyButton.addEventListener('click', function(event) {
        // Use the Clipboard API to copy the commit.oid to the clipboard
        var commitOid = event.currentTarget.getAttribute("data-clipboard-text");
        navigator.clipboard.writeText(commitOid)
        .then(() => {
            // Success feedback here
            console.log('Commit SHA copied to clipboard');
        })
        .catch(err => {
            // Error handling here
            console.error('Could not copy text: ', err);
        });
    });
    commitsContainerDummy.appendChild(newCommitItem);
  }
    

  commitsContainer.appendChild(commitsContainerDummy);
  console.log("DONE EVERYTHING. PUTTING TO UI");

  // Display the branches filter dropdown button with default value only (All branches)
  await loadBranchesButton();
  // setBranchOptions(branchNames, branchNames);

  // setBranchOptions(branchNames, null);
  contentView.innerHTML = "";
  contentView.appendChild(commitsOutsideContainer);
  // contentView.replaceChild(commitsOutsideContainer);

 

  addNextPageButton(commits, branchNames, allCommits, heads, pageNo, repoOwner, repoName);

  drawGraph(commits, commitDict);

  // Redraw the graph each time the height of the commits container changes.
  // This is necessary because the dots have to align even if the user
  // resizes the window and wrapping commit message increases the commit item height.
  // NOTE: This is currently disabled because it causes a bug where the graph
  // is redrawn multiple times when "Load more" is pressed
  // const resizeObserver = new ResizeObserver(entries =>
  //   drawGraph(commits, commitDict)
  // )
  // resizeObserver.observe(commitsContainer);
  return;
}

// Format the date to a human friendly format
// Like "1 day ago", "2 weeks ago", "3 months ago"
function relativeTime(date) {
  var now = new Date().getTime();
  const difference = (now - date.getTime()) / 1000;
  let output = ``;
  if (difference < 10) {
    output = `just now`;
  } else if (difference < 60) {
    output = `${Math.floor(difference)} seconds ago`;
  } else if (difference < 3600) {
    output = `${Math.floor(difference / 60)} minute${Math.floor(difference / 60) > 1 ? 's' : ''} ago`;
  } else if (difference < 86400) {
    output = `${Math.floor(difference / 3600)} hour${Math.floor(difference / 3600) > 1 ? 's' : ''} ago`;
  } else if (difference < 2620800) {
    output = `${Math.floor(difference / 86400) > 1 ? (Math.floor(difference / 86400) + ' days ago') : 'yesterday'}`;
  } else {
    output = 'on ' + date.toLocaleDateString();
  }
  return (output);
}

function addNextPageButton(commits, branchNames, allCommits, heads, pageNo, repoOwner, repoName) {
  var newerButton = document.getElementById("newerButton");
  var olderButton = document.getElementById("olderButton");
  if (commits.length >= 10) {
    olderButton.setAttribute("aria-disabled", "false");
    olderButton.addEventListener("click", function () {
      // fetchFurther(commits, branchNames, allCommits, branches, heads, pageNo);
      fetchFurther(commits.slice(-10), allCommits, heads, pageNo, branchNames, repoOwner, repoName);
    });
  }
}