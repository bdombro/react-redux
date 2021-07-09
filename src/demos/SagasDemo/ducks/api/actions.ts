import type { Category } from '#src/services/targeting';
import * as types from './types'

export function fetchCategories() {
  return {
    type: types.FETCH_CATEGORIES_REQUESTED,
  };
}

export function fetchCategoriesSucceeded(categories: Category[]) {
  return {
    type: types.FETCH_CATEGORIES_SUCCEEDED,
    payload: categories,
  };
}

export function fetchCategoriesFailed(error: any) {
  return {
    type: types.FETCH_CATEGORIES_FAILED,
    error: true,
    payload: error,
  };
}
