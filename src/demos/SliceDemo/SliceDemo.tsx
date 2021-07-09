import React from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'

import { decrement, increment } from './slices/counterSlice'
import store, {RootState} from './store'

export default function SliceDemo() {
	return (
		<Provider store={store}>
			<div>
				<p style={{maxWidth: 500}}>
					Reduxs' recommended way to integrate with React (<a href='https://redux-toolkit.js.org'>ref</a>).</p>
				<p>Redux Toolkit (9kb mini+gz) + Bundle Size: Redux (1.6kb mini+gz) </p>
				<SliceCounter />
			</div>
		</Provider>
	)
}
function SliceCounter() {
	const count = useSelector((state: RootState) => state.counter.value)
	const dispatch = useDispatch()

	return (
		<div>
			<button
				aria-label="Decrement value"
				onClick={() => dispatch(decrement())}
			>
          -
			</button>{' '}
			<span>{count}</span>{' '}
			<button
				aria-label="Increment value"
				onClick={() => dispatch(increment())}
			>
          +
			</button>
		</div>
	)
}
