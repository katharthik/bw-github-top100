import React, { useState } from "react";
import {
  RepoInfo,
  CommitsInfo,
  RootReducerActions,
  CommitInfo
} from "./redux/RootReducer.types";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { fetchCommits } from "./rest-api/rest-api";
import { StoreState } from "./redux/Reducers.types";

function openOverlay() {
  const overlay = document.getElementById("commits-overlay") as HTMLElement;
  const modal = document.getElementById("modal") as HTMLElement;
  overlay.style.display = "block";
  modal.style.display = "block";
}
function closeOverlay() {
  const overlay = document.getElementById("commits-overlay") as HTMLElement;
  const modal = document.getElementById("modal") as HTMLElement;
  overlay.style.display = "none";
  modal.style.display = "none";
}
function Card(props: any, setCurrentRepo: any) {
  return props.items.slice(0, 100).map((item: any, index: number) => {
    return (
      <div className="card" key={item.name + index}>
        <h3 className="repo-title">{index + 1}</h3>
        <img
          className="img"
          alt={item.description}
          src={item.owner.avatar_url}
        ></img>
        <a className="repo-link" href={item.url}>
          {item.name}
        </a>
        <hr></hr>
        <div className="repo-info">
          <button>★Star&nbsp;{item.stargazers_count}</button>
          <div
            style={{ display: "inline", color: "#09d3ac", cursor: "pointer" }}
            onClick={() => {
              if (props.getRepoCommits(item.full_name).items.length === 0)
                fetchCommits(item.full_name).then(resp => {
                  props.saveRepoCommitInfo(resp, item.full_name);
                  setCurrentRepo(item.full_name);
                });
              openOverlay();
            }}
          >
            See commits
          </div>
        </div>
      </div>
    );
  });
}

export const RepositoriesFn = (props: {
  items?: Array<RepoInfo>;
  getRepoCommits: (name: string) => any;
  saveRepoCommitInfo: (info: CommitsInfo, repoName: string) => void;
}) => {
  const [currentRepo, setCurrentRepo] = useState("");
  if (!props.items) return <div>'Items not provided'</div>;

  return (
    <div>
      <div className="cards">{Card(props, setCurrentRepo)}</div>
      <div id="commits-overlay" className="commits-view-overlay"></div>
      <div className="modal" id="modal">
        <div className="overlay-header">
          <h2>Commits in last 24 hrs</h2>
          <button onClick={closeOverlay}>Close</button>
        </div>
        <hr></hr>
        {props
          .getRepoCommits(currentRepo)
          .items.map((commit: CommitInfo, index: number) => (
            <div className="commit-section" key={commit.node_id}>
              <div>
                <span className="commit-date">
                  Commits on {commit.commit.author.date.slice(0, 10)}
                </span>
                <span className="commit-author">
                  by {commit.commit.author.name}
                </span>
              </div>
              <span className="commit-message">
                >&nbsp;{commit.commit.message}
              </span>
              <br />
            </div>
          )) || "-"}
      </div>
    </div>
  );
};

const mapStateToProps = (state: StoreState) => ({
  getRepoCommits: (name: string) => {
    return (
      (state.app.commitsInfo && state.app.commitsInfo[name]) || { items: [] }
    );
  }
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  saveRepoCommitInfo: (info: any, repoName: string) =>
    dispatch({ type: RootReducerActions.SAVE_COMMITS_INFO, info, repoName })
});

export const Repositories = connect(
  mapStateToProps,
  mapDispatchToProps
)(RepositoriesFn);
