import { Action } from "./Action.types";
import { RootReducerState, RootReducerActions } from "./RootReducer.types";

// import { combineReducers } from 'redux';
export const rootReducer = (state: RootReducerState = {
    reposInfo: {
        incomplete_results: true,
        items: [],
        total_count: 0
    }
}, action: Action) => {
    switch (action.type) {
        case RootReducerActions.SAVE_REPOS_INFO:
            if (action.payload.increment) {
                console.log({
                    ...state, reposInfo: {
                        ...action.payload.reposInfo,
                        items: [...(state.reposInfo || { items: [] }).items, ...action.payload.reposInfo.items]
                    }
                });

                return {
                    ...state, reposInfo: {
                        ...action.payload.reposInfo,
                        items: [...(state.reposInfo || { items: [] }).items, ...action.payload.reposInfo.items]
                    }
                }
            };

            return { ...state, reposInfo: action.payload.reposInfo };
        case RootReducerActions.SAVE_COMMITS_INFO:
            return {
                ...state, commitsInfo: {
                    ...(state.commitsInfo || {}), [action.repoName]: action.info
                }
            };
        default:
            break;
    }
    return state;
}