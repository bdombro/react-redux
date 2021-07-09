import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
// import { configureStore } from '@reduxjs/toolkit'
import {rootReducer,rootSaga} from './ducks'


const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
)

// const store = configureStore({
// 	reducer: rootReducer,
//   middleware: [sagaMiddleware],
// })

// must be run after middleware has been applied
sagaMiddleware.run(rootSaga)

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch