import React, {useLayoutEffect} from 'react'
import { Provider } from 'react-redux'

import * as baseComponents from '#src/components'

import store from './store'
import { fetchCategories, fetchCategory } from './ducks/api/actions'
import { getCategories, getCategory } from './ducks/api/selectors'
import { useSagaSelector } from './hooks'

export default function SagasDemo() {
	return (
		<Provider store={store}>
			<WithStore />
		</Provider>
	)
}

function WithStore() {
	return (
			<div>
				<p style={{maxWidth: 500}}>
					A Redux Sagas strategy for accessing an API. Despite my best efforts, I have not yet found{' '}
					a clean/good way to use Redux+Sagas for fetching and caching data with args (i.e. getCategory(2){' '}
					and getCategory(3) simultaneously).
				</p>
				<p>Bundle Size: 3.8kb mini+gz + Redux (1.6kb mini+gz)</p>
				<h3>GRPC-Web Example</h3>
				<Categories />
				<Categories />
			</div>
	)
}

function Categories() {
	const categories = useSagaSelector(fetchCategories, getCategories, {refetchInterval: 10_000})
	const query = {
		data: categories?.length ? categories : undefined,
		error: undefined,
		isLoading: categories?.length ? false : true
	}
	return <baseComponents.CategoryList {...query} />
}


