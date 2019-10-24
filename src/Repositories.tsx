import React, { useEffect, useState, Fragment } from "react";
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
function Card(props: any) {
  return (
    <div className="card">
      <h3 className="repo-title">{props.rank + 1}</h3>
      <img className="img" alt={props.description} src={props.img_url}></img>
      <a className="repo-link" href={props.url}>
        {props.name}
      </a>
      <hr></hr>
      <div className="repo-info">
        <button>★Star&nbsp;{props.star_count}</button>
        <div
          style={{ display: "inline", color: "#09d3ac", cursor: "pointer" }}
          onClick={() => {
            if (props.props.getRepoCommits(props.f_name).items.length === 0)
              fetchCommits(props.f_name).then(resp => {
                console.log(resp, "resp2");
                props.props.saveRepoCommitInfo(resp, props.f_name);
                props.setCurrentRepo(props.f_name);
              });
            openOverlay();
            console.log("item");
          }}
        >
          See commits
        </div>
      </div>
    </div>
  );
}

function cardList(props: any, card: any, rank: Number, setCurrentRepo: any) {
  return (
    <Card
      rank={rank}
      img_url={card.owner.avatar_url}
      name={card.name}
      star_count={card.stargazers_count}
      key={rank}
      f_name={card.full_name}
      props={props}
      setCurrentRepo={setCurrentRepo}
    />
  );
}

export const RepositoriesFn = (props: {
  items?: Array<RepoInfo>;
  getRepoCommits: (name: string) => any;
  saveRepoCommitInfo: (info: CommitsInfo, repoName: string) => void;
}) => {
  const [currentRepo, setCurrentRepo] = useState("");
  const [commits, setCommits] = useState([]);
  useEffect(() => {
    if (currentRepo) console.log(props.getRepoCommits(currentRepo));
  }, [currentRepo]);
  if (!props.items) return <div>'Items not provided'</div>;

  return (
    <div>
      <div className="cards">
        {props.items
          .slice(0, 100)
          .map((item, index) => cardList(props, item, index, setCurrentRepo))}
      </div>
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
                {console.log(commit, "THIS: ")}
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
