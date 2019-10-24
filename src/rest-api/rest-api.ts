import { API_ENDPOINT, SEARCH_REPOS_API, SEARCH_COMMMITS_API } from "./constants"
import { RequestType } from "./RestAPI.types";
import { ReposInfo } from "../redux/RootReducer.types";

export const fetchRepos = (page = 0): Promise<ReposInfo> => {
    return request<ReposInfo>(SEARCH_REPOS_API + `&page=${page + 1}`);
}

export const fetchCommits = (repo: string): Promise<any> => {
    const date = new Date();
    const dateTime = date.getTime();
    const hrs24 = 24 * 60 * 60 * 60;
    const prevDate = new Date(dateTime - hrs24);
    return request<any>(SEARCH_COMMMITS_API.replace('${repo}', repo) + `${prevDate.getFullYear()}-${prevDate.getMonth() - 1 < 10 ? '0' : ''}${prevDate.getMonth() - 1}-${prevDate.getDate()}`, RequestType.GET, {
        headers: {
            Accept: 'application/vnd.github.cloak-preview'
        }
    });
}

const request = <T>(url: string, type: RequestType = RequestType.GET, options?: any): Promise<T> => {
    return new Promise((resolve, reject) => {
        fetch(API_ENDPOINT + url, {
            method: type,
            ...options
        }).then(response => {
            resolve(response.json())
        }).catch(err => {
            reject(err)
        });
    });
}