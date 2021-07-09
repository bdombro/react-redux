import type { Category } from '#src/services/targeting';
import { combineReducers } from 'redux';
import * as types from './types';

type CategoriesState = Category[]
const categoriesInitial: CategoriesState = []
export function categories(state: CategoriesState = categoriesInitial, action) {
  switch (action.type) {
    case types.FETCH_CATEGORIES_SUCCEEDED:
      return action.payload as CategoriesState;
    case types.FETCH_CATEGORIES_FAILED:
    default:
      return state;
  }
}

export default combineReducers({
  categories,
});
