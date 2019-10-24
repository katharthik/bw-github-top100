import React, { useEffect, useState } from "react";
import "./App.scss";
import { connect } from "react-redux";
import { StoreState } from "./redux/Reducers.types";
import { fetchRepos } from "./rest-api/rest-api";
import {
  RootReducerActions,
  ReposInfo,
  RepoInfo
} from "./redux/RootReducer.types";
import { Dispatch } from "redux";
import { Repositories } from "./Repositories";

const { SAVE_REPOS_INFO } = RootReducerActions;

const App: React.FC<{
  reposInfo?: ReposInfo;
  saveReposInfo?: (info: ReposInfo, increment?: boolean) => void;
}> = props => {
  const [reposFetched, setreposFetched] = useState<boolean>(false);
  const [fetchIteration, setFetchIteration] = useState<number>(0);
  useEffect(() => {
    if (!reposFetched && fetchIteration < 4) {
      fetchRepos(fetchIteration).then((response: ReposInfo) => {
        setFetchIteration(fetchIteration + 1);
        if (props.saveReposInfo) {
          props.saveReposInfo(response, fetchIteration > 0);
        }
        if (fetchIteration > 1) setreposFetched(true);
      });
    }
  }, [fetchIteration]);
  const {
    reposInfo = {
      total_count: 0,
      items: []
    }
  } = props;
  return (
    <div className="App">
      <header className="App-header">Github Top 100 repositories</header>
      {reposFetched
        ? (!reposInfo.total_count && "No Repositories found") || (
            <Repositories items={reposInfo.items} />
          )
        : "Loading..."}
    </div>
  );
};

const mapStateToProps: any = (state: StoreState) => ({
  reposInfo: state.app.reposInfo
});
const mapDispatchToProps: any = (dispatch: Dispatch) => ({
  saveReposInfo: (reposInfo: ReposInfo, increment?: boolean) =>
    dispatch({ type: SAVE_REPOS_INFO, payload: { reposInfo, increment } })
});

export default connect<
  { reposInfo: RepoInfo[] },
  { saveRepoInfo: (info: ReposInfo) => void }
>(
  mapStateToProps,
  mapDispatchToProps
)(App);
