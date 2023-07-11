import { getLocalToken } from "./getLocalToken";
import { parseDate } from "./sortCommits";
import { showCommits } from "./showCommits";
import { showLegend } from "./showLegend";

// This function fetches sufficient commits from the API
// so that the order can be assured to be maintained.
// Then this function calls the drawGraph function which
// will clear the existing graph and redraw it.

// The idea is to fetch the last 20 commits in the history
// of each of the last 10 commits that are displayed.
export async function fetchFurther(commits, allCommits, heads, pageNo, branchNames, repoOwner, repoName) {
  // commits array just contains the last 10 commits so that their 
  // 10 levels of history can be fetched.

  // Adding the loader to the UI
  var commitsOl = document.getElementById("commitsOl");

  // var loadingIcon = chrome.runtime.getURL('html/commitsLoading.html');
  // fetch(loadingIcon).then(response => response.text()).then(loadingIconText => {
  //   var tempDiv = document.createElement('div');
  //   tempDiv.innerHTML = loadingIconText;
  //   var newContent = tempDiv.firstChild;
  //   commitsOl.appendChild(newContent);
  // });

  var loadingIconText = `
  <div class="Box Box--responsive text-center rounded-2 border color-border-muted">
  <style>
      @keyframes spinner {
          to {
              transform: rotate(360deg);
          }
      }

      .spinner:before {
          content: '';
          box-sizing: border-box;
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          margin-top: -10px;
          margin-left: -10px;
          border-radius: 50%;
          border: 2px solid #ccc;
          border-top-color: #000;
          animation: spinner .6s linear infinite;

      }
  </style>
  <div class="position-relative">
      <div class="col-9 mx-auto py-3">
          <div class="spinner my-11" style="display: block !important;"></div>
      </div>
  </div>
</div>
  `;

  var tempDiv = document.createElement('div');
  tempDiv.innerHTML = loadingIconText.trim();
  var newContent = tempDiv.firstElementChild;
  commitsOl.appendChild(newContent);

  // var presentUrl = window.location.href;
  // var repoOwner = presentUrl.split('/')[3];
  // var repoName = presentUrl.split('/')[4];
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
  if (commits.length < 10) {
    return (false);
  }
  var lastTenCommits = commits.slice(commits.length - 20, commits.length);
  for (var i = 0; i < lastTenCommits.length; i++) {
    queryContent += `
        commit`+ i + `: object(oid: "` + lastTenCommits[i].oid + `") {
            ... on Commit{
                
                history(first: 20) {
                    edges {
                        node {
                            ... on Commit {
                                oid
                                messageHeadlineHTML
                                committedDate
                            }  
                        }
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
  var newlyFetchedCommits = data.data.repository;
  for (var newCommitId in newlyFetchedCommits) {
    var newCommit = newlyFetchedCommits[newCommitId];
    var thisCommits = newCommit.history.edges;
    for (var thisCommit of thisCommits) {
      thisCommit = thisCommit.node;
      thisCommit.committedDate = parseDate(thisCommit.committedDate);
      allCommits.push(thisCommit);
    }
  }

  // The main fetchFurther algorithm fetches 20 commits before each of the 10 displayed commits.
  // As there could be many overlap between the history of different branches,
  // many of the commits would be duplicates. This algorithm removes duplicates, while keeping the
  // details of commits previously fetched from API. [If already fetched]
  var commitObject = {};

  for (var newCommit of allCommits) {
    if (commitObject[newCommit.oid] == undefined) {
      commitObject[newCommit.oid] = newCommit;
    }
    else {
      for (var parameter in newCommit) {
        commitObject[newCommit.oid][parameter] = newCommit[parameter];
      }
    }
  }

  allCommits = [];
  for (var commit in commitObject) {
    allCommits.push(commitObject[commit]);
  }

  allCommits.sort(function (a, b) {
    return b.committedDate - a.committedDate;
  });
  pageNo += 1;
  var commitsToShow = (allCommits.slice(0, 10 * pageNo));
  await showCommits(commitsToShow, branchNames, allCommits, heads, pageNo, repoOwner, repoName);
  showLegend(heads);
}