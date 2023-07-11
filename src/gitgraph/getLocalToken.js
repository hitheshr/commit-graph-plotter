export function getLocalToken() {
    return localStorage.getItem('GithubOAuthToken');
}

export function storeLocalToken(token) {
    localStorage.setItem('GithubOAuthToken', token);
}

export function getLocalUserName() {
    return localStorage.getItem("GithubUserName");
}

export function storeLocalUserName(userName) {
    localStorage.setItem("GithubUserName", userName);
}