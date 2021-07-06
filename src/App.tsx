import React, {useCallback} from 'react'
import { useDispatch,useSelector } from 'react-redux'

import type { Category } from './services/targeting'
import { useGetPokemonByNameQuery } from './store/api/pokeapi'
import { useGetCategoriesQuery, useGetCategoryQuery, useLogClickMutation } from './store/api/targeting'
import { decrement, increment } from './store/slices/counterSlice'
import type { RootState } from './store/store'

export default function App() {
	return (
		<div style={{ margin: 50}}>
			<h2>Redux-Tools Slice Demo</h2>
			<p style={{maxWidth: 500}}>
				Reduxs' recommended way to integrate with React (<a href='https://redux-toolkit.js.org'>ref</a>).</p>
			<CounterComponent />
			<h2>Redux-Tools RTK Query Demo</h2>
			<p style={{maxWidth: 500}}>
				Reduxs' recommended way to fetch from APIs (<a href='https://redux-toolkit.js.org/tutorials/rtk-query'>ref</a>).{' '}
				Notice how these components share a fetch despite mounting simultaneously, aka race-de-duping</p>
			<h3>Rest Example</h3>
			<PokemonComponent nameSlug={'pikachu'} />
			<PokemonComponent nameSlug={'pikachu'} />
			<h3>GRPC-Web Example</h3>
			<CategoriesComponentRtk />
			<CategoriesComponentRtk />
			<CategoryComponentRtk id={1} />
			<CategoryComponentRtk id={1} />
			<CategoryComponentRtk id={1} />
		</div>
	)
}

function CounterComponent() {
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

function PokemonComponent({nameSlug}: {nameSlug: string}) {
	const { data: pokemon, error, isLoading } = useGetPokemonByNameQuery(nameSlug)

	return (
		<div>
			{isLoading ? (
				<>Loading...</>
			)	: pokemon !== undefined ? (
				<>
					<h3>{pokemon.species.name}</h3>
					<img src={pokemon.sprites.front_shiny} alt={pokemon.species.name} />
				</>
			) : (
				<>Error: {error ? 'Not Found' : 'unknown'}</>
			)}
		</div>
	)
}

function CategoriesComponentRtk() {
	const query = useGetCategoriesQuery({})
	const [logClick] = useLogClickMutation()
	const onClick = useCallback(onClickCb, [])
	return <CategoriesComponentView {...query} onClick={onClick} />

	function onClickCb(e: any, category: Category) {
		e.preventDefault()
		logClick({id: category.id})
			.then(r => 'error' in r && console.error(r.error.message))
	}
}

function CategoryComponentRtk({id}: {id: number}) {
	const query = useGetCategoryQuery({id})
	const [logClick] = useLogClickMutation()
	const onClick = useCallback(onClickCb, [])
	return <CategoryComponentView {...query} onClick={onClick} />

	function onClickCb(e: any, category: Category) {
		e.preventDefault()
		logClick({id: category.id})
			.then(r => 'error' in r && console.error(r.error.message))
	}
}

function CategoriesComponentView({
	data,
	error,
	isLoading,
	onClick
}: {
	data?: readonly Category[],
	error?: any,
	isLoading: boolean,
	onClick(e: any, category: Category): any
}) {
	return (
		<div>
			<h4>Category Click Counts</h4>
			{isLoading ? (
				<>Loading...</>
			)	: data !== undefined ? (
				data.map(c => (
					<div key={c.id}>
						<a href="#" onClick={e => onClick(e, c)}>{c.tag}</a>{' '}
						- {c.clickCount}
					</div>
				))
			) : (
				<>Error: {error?.message || 'unknown'}</>
			)}
		</div>
	)
}

function CategoryComponentView({
	data,
	error,
	isLoading,
	onClick
}: {
	data?: Category,
	error?: any,
	isLoading: boolean,
	onClick(e: any, category: Category): any
}) {

	return (
		<div>
			<h4>Category</h4>
			{isLoading ? (
				<>Loading...</>
			)	: data !== undefined ? (
				<div>
					<a href="#" onClick={e => onClick(e, data)}>{data.tag}</a>{' '}
							- {data.clickCount}
				</div>
			) : (
				<>Error: {error?.message || 'unknown'}</>
			)}
		</div>
	)

	
}
