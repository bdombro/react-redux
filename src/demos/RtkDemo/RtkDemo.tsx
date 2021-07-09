import React, {useCallback} from 'react'
import { Provider } from 'react-redux'

import type { Category as CategoryType } from '#services/targeting'
import * as baseComponents from '#src/components'

import { useGetPokemonByNameQuery } from './api/pokeapi'
import { useGetCategoriesQuery, useGetCategoryQuery, useLogClickMutation } from './api/targeting'
import store from './store'

export default function RtkDemo() {
	return (
		<Provider store={store}>
			<div>
				<p style={{maxWidth: 500}}>
				Reduxs' recommended way to fetch from APIs (<a href='https://redux-toolkit.js.org/tutorials/rtk-query'>ref</a>).{' '}
				Notice how these s share a fetch despite mounting simultaneously, aka race-de-duping</p>
				<p>Bundle Size: 11kb mini+gz + Redux (1.6kb mini+gz) + Redux Toolkit (9kb mini+gz)</p>
				<h3>Rest Example</h3>
				<Pokemon nameSlug={'pikachu'} />
				<Pokemon nameSlug={'pikachu'} />
				<h3>GRPC-Web Example</h3>
				<Categories />
				<Categories />
				<Category id={0} />
				<Category id={1} />
			</div>
		</Provider>
	)
}

function Pokemon({nameSlug}: {nameSlug: string}) {
	const query = useGetPokemonByNameQuery(nameSlug, {pollingInterval: 10_000})
	return <baseComponents.PokemonDetail {...query} />
}
function Categories() {
	const query = useGetCategoriesQuery({}, {pollingInterval: 10_000})
	return <baseComponents.CategoryList {...query} />
}
function Category({id}: {id: number}) {
	const query = useGetCategoryQuery({id}, {pollingInterval: 10_000})
	const [logClick] = useLogClickMutation()
	const onClick = useCallback(onClickCb, [])
	
	return <baseComponents.CategoryDetail {...query} onClick={onClick} />
	function onClickCb(category: CategoryType) {
		logClick({id: category.id})
			.then(r => 'error' in r && console.error(r.error.message))
	}
}
