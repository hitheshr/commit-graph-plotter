import { getLocalToken } from "./getLocalToken";
import { getLocalUserName } from "./getLocalToken";

export async function loadBranchesButton() {
    var contentView = document.getElementsByClassName("main-content-container")[0];
    // var branchSelectionHtml = chrome.runtime.getURL('html/branchSelection.html');
    var branchSelectionHtmlText = `
    <div class="file-navigation">
  <div class="position-relative">
    <div style="display: flex;
      justify-content: space-between;">
      <div style="display: flex">
        <details class="details-reset details-overlay mr-0 mb-0 " id="branch-select-menu">
          <summary class="btn css-truncate" data-hotkey="w" title="Switch branches or tags">
            <svg text="gray" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"
              data-view-component="true" class="octicon octicon-git-branch">
              <path fill-rule="evenodd"
                d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z">
              </path>
            </svg>
            <span class="css-truncate-target" data-menu-button="">All branches</span>
            <span class="dropdown-caret"></span>
          </summary>
          <div class="SelectMenu">
            <div class="SelectMenu-modal">
              <header class="SelectMenu-header">
                <span class="SelectMenu-title">Select branches to show</span>
                <button class="SelectMenu-closeButton" type="button" data-toggle-for="branch-select-menu"><svg
                    aria-label="Close menu" aria-hidden="false" role="img" height="16" viewBox="0 0 16 16" version="1.1"
                    width="16" data-view-component="true" class="octicon octicon-x">
                    <path fill-rule="evenodd"
                      d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z">
                    </path>
                  </svg></button>
              </header>
              <input-demux>
                <div class="d-flex flex-column flex-auto overflow-auto">
                  <ref-selector can-create="" cache-key="v0:1658855174.97134" current-committish="bWFpbg=="
                    default-branch="bWFpbg==" name-with-owner="TmlybWFsU2NhcmlhL2NvbW1pdFRlc3Q="
                    prefetch-on-mouseover="" data-catalyst="">

                    <template data-target="ref-selector.fetchFailedTemplate">
                      <div class="SelectMenu-message" data-index="{{ index }}">Could not load branches</div>
                    </template>
                    <div data-target="ref-selector.listContainer" role="menu" class="SelectMenu-list "
                      data-pjax="#repo-content-pjax-container" data-turbo-frame="repo-content-turbo-frame"
                      style="max-height: 330px;">
                      <div id="branches-sized-container"
                        style="position: relative; overflow: hidden; width: 100%; min-height: 100%; will-change: transform; height: 99px;">
                        <div style="position:absolute; top:0; left:0; height:100%; width:100%; overflow:visible;"
                          id="branches-list-parent">
                          <a class="SelectMenu-item" role="menuitemradio" rel="nofollow" aria-checked="true"
                            data-index="0">
                            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"
                              data-view-component="true"
                              class="octicon octicon-check SelectMenu-icon SelectMenu-icon--check">
                              <path fill-rule="evenodd"
                                d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z">
                              </path>
                            </svg>
                            <span class="flex-1 css-truncate css-truncate-overflow ">All branches</span>
                          </a>
                          <span></span>
                        </div>
                      </div>
                    </div>
                    <template data-target="ref-selector.itemTemplate">
                      <a href="https://github.com/NirmalScaria/commitTest/commits/{{ urlEncodedRefName }}"
                        class="SelectMenu-item" role="menuitemradio" rel="nofollow" aria-checked="{{ isCurrent }}"
                        data-index="{{ index }}">
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"
                          data-view-component="true"
                          class="octicon octicon-check SelectMenu-icon SelectMenu-icon--check">
                          <path fill-rule="evenodd"
                            d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z">
                          </path>
                        </svg>
                        <span class="flex-1 css-truncate css-truncate-overflow {{ isFilteringClass }}">{{ refName
                          }}</span>
                        <span hidden="{{ isNotDefault }}" class="Label Label--secondary flex-self-start">default</span>
                      </a>
                    </template>
                    <footer class="SelectMenu-footer"><a aria-disabled="true">Show selected branches</a>
                    </footer>
                  </ref-selector>
                </div>
              </input-demux>
            </div>
          </div>
        </details>
        <img src="https://github.com/NirmalScaria/NirmalScaria.github.io/raw/master/assets/prompt.png" height="32px" class="ml-3" id="promptImage"
          style="border-radius: 5px; display: none; cursor: pointer;">
      </div>
      <div id="legendContainer" style="display: none;">
        <summary class="btn css-truncate ml-2" value="" style=" pointer-events: none !important;" id="branchButton">
          <svg text="gray" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"
            data-view-component="true" class="octicon octicon-git-branch">
            <circle cx="7" cy="8" r="4" fill="#fd7f6f" legendsha="9df9bc09cea4f00ff2aa11ad91a7055310cd660b"
              id="insideCircle"></circle>
            <circle cx="7" cy="8" r="7" stroke="#fd7f6f" fill="#00000000"
              legendsha="9df9bc09cea4f00ff2aa11ad91a7055310cd660b" id="outsideCircle"></circle>
          </svg>
          <span class="css-truncate-target" data-menu-button="" id="branchName">Loading...</span>
        </summary>
      </div>
    </div>
  </div>
</div>
    `;

    // await fetch(branchSelectionHtml).then(response => response.text()).then(branchSelectionHtmlText => {
    //     var tempDiv = document.createElement('div');
    //     tempDiv.innerHTML = branchSelectionHtmlText;
    //     var newContent = tempDiv.firstChild;
    //     contentView.innerHTML = "";
    //     contentView.appendChild(newContent);
    //     var token = getLocalToken();
    //     var userName = getLocalUserName();
    //     var url = "https://custom-us-central1-github-tree-graph.cloudfunctions.net/prompt?userName=" + userName;
    //     var xhr = new XMLHttpRequest();
    //     xhr.open("GET", url, true);
    //     xhr.onreadystatechange = function () {
    //         if (xhr.readyState == 4) {
    //             var resp = JSON.parse(xhr.responseText);
    //             var showPrompt = resp.showPrompt;
    //             console.log("showPrompt: " + showPrompt);
    //             if (showPrompt) {
    //                 document.getElementById("promptImage").style.display = "inline-block";
    //                 document.getElementById("promptImage").addEventListener("click", function () {
    //                     window.open("https://hithesh.dev/redirection.html", "_blank");
    //                 });
    //             }
    //         }
    //     }
    //     xhr.send();
    // });

    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = branchSelectionHtmlText.trim();
    var newContent = tempDiv.firstElementChild;
    // contentView.innerHTML = branchSelectionHtmlText;
    contentView.appendChild(newContent);
    // var token = getLocalToken();
    // var userName = getLocalUserName();
    // var url = "https://custom-us-central1-github-tree-graph.cloudfunctions.net/prompt?userName=" + userName;
    // var xhr = new XMLHttpRequest();
    // xhr.open("GET", url, true);
    // xhr.onreadystatechange = function () {
    //     if (xhr.readyState == 4) {
    //         var resp = JSON.parse(xhr.responseText);
    //         var showPrompt = resp.showPrompt;
    //         console.log("showPrompt: " + showPrompt);
    //         if (showPrompt) {
    //             document.getElementById("promptImage").style.display = "inline-block";
    //             document.getElementById("promptImage").addEventListener("click", function () {
    //                 window.open("https://hithesh.dev/redirection.html", "_blank");
    //             });
    //         }
    //     }
    // }
    // xhr.send();

    return;
}