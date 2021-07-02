import React from 'react'
import { useDispatch,useSelector } from 'react-redux'

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
			<CategoriesComponent />
			<CategoriesComponent />
			<CategoryComponent id={1} />
			<CategoryComponent id={1} />
			<CategoryComponent id={1} />
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

function CategoriesComponent() {
	const { data: categories, error, isLoading } = useGetCategoriesQuery({})
	const [logClick] = useLogClickMutation()

	type Categories = Exclude<typeof categories, undefined>

	return (
		<div>
			<h4>Category Click Counts</h4>
			{isLoading ? (
				<>Loading...</>
			)	: categories !== undefined ? (
				categories.map(c => (
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

	function onClick(e: any, category: Categories[0]) {
		e.preventDefault()
		logClick({id: category.id})
			.then(r => 'error' in r && console.error(r.error.message))
	}
}

function CategoryComponent({id}: {id: number}) {
	const { data: category, error, isLoading } = useGetCategoryQuery({id})
	const [logClick] = useLogClickMutation()

	type Category = Exclude<typeof category, undefined>

	return (
		<div>
			<h4>Category</h4>
			{isLoading ? (
				<>Loading...</>
			)	: category !== undefined ? (
				<div>
					<a href="#" onClick={e => onClick(e, category)}>{category.tag}</a>{' '}
							- {category.clickCount}
				</div>
			) : (
				<>Error: {error?.message || 'unknown'}</>
			)}
		</div>
	)

	function onClick(e: any, category: Category) {
		e.preventDefault()
		logClick({id: category.id})
			.then(r => 'error' in r && console.error(r.error.message))
	}
}