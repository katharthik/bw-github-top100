export const API_ENDPOINT = "https://api.github.com";
export const SEARCH_REPOS_API =
  "/search/repositories?q=is:public&sort=stars&order=desc";
export const SEARCH_COMMMITS_API =
  "/search/commits?q=is:public+repo:${repo}+committer-date:>";
