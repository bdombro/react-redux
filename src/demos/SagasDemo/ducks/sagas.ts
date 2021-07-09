import { all } from "redux-saga/effects";

import apiSaga from './api/sagas'

export default function* rootSaga() {
  yield all([
		apiSaga(),
	])
}