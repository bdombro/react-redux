import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { pokemonApi } from './api/pokeapi'
import { targetingApi } from './api/targeting'
import counterSlice from './slices/counterSlice'

const store = configureStore({
	reducer: {
		counter: counterSlice,
		[pokemonApi.reducerPath]: pokemonApi.reducer,
		[targetingApi.reducerPath]: targetingApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(pokemonApi.middleware)
			.concat(targetingApi.middleware),
})

setupListeners(store.dispatch)

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch