import { Action } from 'redux';
import { RootReducerActions } from './RootReducer.types';
export interface Action extends Action {
    type: string | RootReducerActions;
    payload: any;
    [key: string]: any
}