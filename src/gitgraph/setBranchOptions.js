export function setBranchOptions(branches, selectedBranchNames) {
    var branchesContainer = document.getElementById("branches-list-parent");
    var existingChild = branchesContainer.children[0];

    // Add each branch to the dropdown list.
    Array.from(branches).forEach((branch) => {
        var newChild = existingChild.cloneNode(true);
        newChild.children[1].innerHTML = branch;
        newChild.setAttribute("branch-name", branch);
        newChild.addEventListener("click", () => {
            var thisItem = document.querySelector(`[branch-name="${branch}"]`);

            if (selectedBranchNames.includes(branch)) {
                selectedBranchNames = selectedBranchNames.filter(id => id != branch);
                thisItem.setAttribute("aria-checked", "false");
            }
            else {
                selectedBranchNames.push(branch);
                thisItem.setAttribute("aria-checked", "true");
            }
            if (branches.length == selectedBranchNames.length) {
                branchesContainer.children[0].setAttribute("aria-checked", "true");
            }
            else {
                branchesContainer.children[0].setAttribute("aria-checked", "false");
            }
        }
        );
        branchesContainer.appendChild(newChild);
    });

    // Action for the "All branches" button
    branchesContainer.children[0].addEventListener("click", () => {
        if (branchesContainer.children[0].getAttribute("aria-checked") == "true") {
            selectedBranchNames = [];
            Array.from(branchesContainer.children).forEach((child) => {
                child.setAttribute("aria-checked", "false");
            }
            );
        }
        else {
            selectedBranchNames = [];
            var i = 0;
            Array.from(branchesContainer.children).forEach((child) => {
                child.setAttribute("aria-checked", "true");
                if (i != 0 && branchesContainer.children[i].getAttribute("branch-name") != null) {
                    selectedBranchNames.push(child.getAttribute("branch-name"));
                }
                i += 1;
            });
        }
    });
    var sizedContainer = document.getElementById("branches-sized-container");
    sizedContainer.style.height = (35 * branches.length + 45) + "px";
}