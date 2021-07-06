import React, {useCallback, useState} from 'react'
import { useDispatch,useSelector } from 'react-redux'

import type { Category } from './services/targeting'
import { useGetPokemonByNameQuery } from './store/api/pokeapi'
import { useGetCategoriesQuery, useGetCategoryQuery, useLogClickMutation } from './store/api/targeting'
import { decrement, increment } from './store/slices/counterSlice'
import type { RootState } from './store/store'
import * as useAsyncApiFncs from './useAsync/api'
import useAsync from './useAsync/useAsync'

export default function App() {
	const [fetchLib, setFetchLib] = useState<string>('')
	return (
		<div style={{ margin: 50}}>
			<h2>Redux-Tools Slice Demo</h2>
			<p style={{maxWidth: 500}}>
				Reduxs' recommended way to integrate with React (<a href='https://redux-toolkit.js.org'>ref</a>).</p>
			<Counter />

			<h2>Query Demo</h2>
			<select value={fetchLib} onChange={v => setFetchLib(v.target.value)}>
				<option disabled value=''> -- select an option -- </option>
				<option value='RTK'>Redux Toolkit RTK</option>
				<option value='useAsync'>Custom useAsync</option>
			</select>

			{
				fetchLib === 'RTK' && <RtkDemo />
				|| fetchLib === 'useAsync' && <UseAsyncDemo />
				|| <></>
			}

			
		</div>
	)
}

function RtkDemo() {
	return <div>
		<p style={{maxWidth: 500}}>
				Reduxs' recommended way to fetch from APIs (<a href='https://redux-toolkit.js.org/tutorials/rtk-query'>ref</a>).{' '}
				Notice how these s share a fetch despite mounting simultaneously, aka race-de-duping</p>
		<h3>Rest Example</h3>
		<PokemonRtk nameSlug={'pikachu'} />
		<PokemonRtk nameSlug={'pikachu'} />
		<h3>GRPC-Web Example</h3>
		<CategoriesRtk />
		<CategoriesRtk />
		<CategoryRtk id={0} />
		<CategoryRtk id={1} />
		<CategoryRtk id={0} />
		<CategoryRtk id={1} />
	</div>
}

function UseAsyncDemo() {
	return <div>
		<p style={{maxWidth: 500}}>
				A smart, custom fetch hook similar to react-query.{' '}
				Notice how these components share a fetch despite mounting simultaneously, aka race-de-duping</p>
		<h3>Rest Example</h3>
		<PokemonUseAsync nameSlug={'pikachu'} />
		<PokemonUseAsync nameSlug={'pikachu'} />
		<h3>GRPC-Web Example</h3>
		<CategoriesUseAsync />
		<CategoriesUseAsync />
		<CategoryUseAsync id={0} />
		<CategoryUseAsync id={1} />
		<CategoryUseAsync id={0} />
		<CategoryUseAsync id={1} />
	</div>
}

function Counter() {
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

function PokemonRtk({nameSlug}: {nameSlug: string}) {
	const query = useGetPokemonByNameQuery(nameSlug)
	return <PokemonView {...query} />
}
function CategoriesRtk() {
	const query = useGetCategoriesQuery({})
	const [logClick] = useLogClickMutation()
	const onClick = useCallback(onClickCb, [])
	return <CategoriesView {...query} onClick={onClick} />
	function onClickCb(e: any, category: Category) {
		e.preventDefault()
		logClick({id: category.id})
			.then(r => 'error' in r && console.error(r.error.message))
	}
}
function CategoryRtk({id}: {id: number}) {
	const query = useGetCategoryQuery({id})
	const [logClick] = useLogClickMutation()
	const onClick = useCallback(onClickCb, [])
	return <CategoryView {...query} onClick={onClick} />
	function onClickCb(e: any, category: Category) {
		e.preventDefault()
		logClick({id: category.id})
			.then(r => 'error' in r && console.error(r.error.message))
	}
}

function PokemonUseAsync({nameSlug}: {nameSlug: string}) {
	const query = useAsync(useAsyncApiFncs.getPokemonByName, {mode: 'vivaLaCache'}, nameSlug)
	return <PokemonView {...query} />
}
function CategoriesUseAsync() {
	const query = useAsync(useAsyncApiFncs.getCategories, {mode: 'vivaLaCache'}, {})
	const onClick = useCallback(onClickCb, [])
	return <CategoriesView {...query} onClick={onClick} />
	function onClickCb(e: any, category: Category) {
		e.preventDefault()
		useAsyncApiFncs.logClick({id: category.id})
	}
}
function CategoryUseAsync({id}: {id: number}) {
	const query = useAsync(useAsyncApiFncs.getCategory, {mode: 'vivaLaCache'}, {id})
	const onClick = useCallback(onClickCb, [])
	return <CategoryView {...query} onClick={onClick} />
	function onClickCb(e: any, category: Category) {
		e.preventDefault()
		useAsyncApiFncs.logClick({id: category.id})
	}
}

function PokemonView({
	data,
	error,
	isLoading,
}: {
	data?: Pokemon,
	error?: any,
	isLoading: boolean,
}) {

	return (
		<div>
			{
				isLoading && <>
					Loading...
				</>
				|| data !== undefined && <>
					<h3>{data.species.name}</h3>
					<img src={data.sprites.front_shiny} alt={data.species.name} />
				</>
				|| <>
					Error: {error ? 'Not Found' : 'unknown'}
				</>
			}
		</div>
	)
}

function CategoriesView({
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

function CategoryView({
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
