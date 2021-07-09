import { all, put, call, select, takeEvery } from 'redux-saga/effects';
import * as types from './types';
import * as actions from './actions';
import * as api from '#src/api'
import type { Category } from '#src/services/targeting';

export function* fetchCategories(): Generator<Category[], void, boolean> {
  try {
    // const storedCategories = yield select(getCategories);

    // if (storedCategories?.[0]) {
    //   yield put(
    //     actions.fetchCategoriesSucceeded(storedCategories),
    //   );
    //   return;
    // }
    const categories = yield call(api.getCategories);
    yield put(actions.fetchCategoriesSucceeded(categories));
  } catch (error) {
    yield put(actions.fetchCategoriesFailed(error));
  }
}
function* watchForFetchCategories() {
  yield takeEvery(
    types.FETCH_CATEGORIES_REQUESTED,
    fetchCategories,
  );
}


export default function* targetingDataSaga() {
  yield all([
    watchForFetchCategories(),
  ]);
}
