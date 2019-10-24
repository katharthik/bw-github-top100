import { createStore, combineReducers } from 'redux';
import { rootReducer } from './rootReducer';

const reducers = combineReducers<{}>({ app: rootReducer });

export const store = createStore(reducers);