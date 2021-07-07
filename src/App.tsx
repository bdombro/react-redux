import React, {useCallback, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import * as api from './api'
import { cacheKeys } from './api'
import {useMutation as useMutationCustom, useQuery as useQueryCustom} from './lib/query'
import { queryClient, QueryClientProvider, useMutation, useQuery } from './lib/react-query'
import type { Category } from './services/targeting'
import { useGetPokemonByNameQuery } from './store/api/pokeapi'
import { useGetCategoriesQuery, useGetCategoryQuery, useLogClickMutation } from './store/api/targeting'
import { decrement, increment } from './store/slices/counterSlice'
import type { RootState } from './store/store'

export default function App() {
	const [fetchLib, setFetchLib] = useState<string>('')
	return (
		<div style={{ margin: 50}}>
			<b>DEMO</b>: <select value={fetchLib} onChange={v => setFetchLib(v.target.value)}>
				<option disabled value=''> -- select an option -- </option>
				<option value='Slices'>Redux Toolkit Slices</option>
				<option value='RTK'>Redux Toolkit RTK</option>
				<option value='react-query'>react-query</option>
				<option value='useQueryCustom'>Custom useQueryCustom</option>
			</select>
			{
				fetchLib === '' && <></>
				|| fetchLib === 'Slices' && <SliceDemo />
				|| fetchLib === 'RTK' && <RtkDemo />
				|| fetchLib === 'react-query' && <ReactQueryDemo />
				|| fetchLib === 'useQueryCustom' && <UseQueryCustomDemo />
				|| <>Error: Unknown Selection</>
			}
		</div>
	)
}

function SliceDemo() {
	return <div>
		<p style={{maxWidth: 500}}>
				Reduxs' recommended way to integrate with React (<a href='https://redux-toolkit.js.org'>ref</a>).</p>
		<SliceCounter />
	</div>
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

function ReactQueryDemo() {
	return (
		<QueryClientProvider client={queryClient}>
			<div>
				<p style={{maxWidth: 500}}>
				A smart, custom fetch hook similar to react-query.{' '}
				Notice how these components share a fetch despite mounting simultaneously, aka race-de-duping</p>
				<h3>Rest Example</h3>
				<PokemonReactQuery nameSlug={'pikachu'} />
				<PokemonReactQuery nameSlug={'pikachu'} />
				<h3>GRPC-Web Example</h3>
				<CategoriesReactQuery />
				<CategoriesReactQuery />
				<CategoryReactQuery id={0} />
				<CategoryReactQuery id={1} />
				<CategoryReactQuery id={0} />
				<CategoryReactQuery id={1} />
			</div>
		</QueryClientProvider>
	)
}
function PokemonReactQuery({nameSlug}: {nameSlug: string}) {
	const query = useQuery(
		['getPokemonByName', nameSlug],
		() => api.getPokemonByName(nameSlug),
		{refetchOnMount: false},
	)
	return <PokemonView {...query} />
}
function CategoriesReactQuery() {
	const query = useQuery(
		cacheKeys.category,
		() => api.getCategories(),
		{refetchOnMount: false, refetchInterval: 10_000},
	)
	const logClickM = useMutation((id: number) => api.logClick({id}))
	const onClick = useCallback(onClickCb, [])
	return <CategoriesView {...query} onClick={onClick} />
	function onClickCb(e: any, category: Category) {
		e.preventDefault()
		logClickM.mutate(category.id)
	}
}
function CategoryReactQuery({id}: {id: number}) {
	const query = useQuery(
		[cacheKeys.category, id],
		() => api.getCategory({id}),
		{refetchOnMount: false, refetchInterval: 10_000},
	)
	const logClickM = useMutation((id: number) => api.logClick({id}))
	const onClick = useCallback(onClickCb, [])
	return <CategoryView {...query} onClick={onClick} />
	function onClickCb(e: any, category: Category) {
		e.preventDefault()
		logClickM.mutate(category.id)
	}
}


function UseQueryCustomDemo() {
	return <div>
		<p style={{maxWidth: 500}}>
				A smart, custom fetch hook similar to react-query.{' '}
				Notice how these components share a fetch despite mounting simultaneously, aka race-de-duping</p>
		<h3>Rest Example</h3>
		<PokemonUseQueryCustom nameSlug={'pikachu'} />
		<PokemonUseQueryCustom nameSlug={'pikachu'} />
		<h3>GRPC-Web Example</h3>
		<CategoriesUseQueryCustom />
		<CategoriesUseQueryCustom />
		<CategoryUseQueryCustom id={0} />
		<CategoryUseQueryCustom id={1} />
		<CategoryUseQueryCustom id={0} />
		<CategoryUseQueryCustom id={1} />
	</div>
}
function PokemonUseQueryCustom({nameSlug}: {nameSlug: string}) {
	const query = useQueryCustom(
		api.getPokemonByName,
		[nameSlug],
		{refetchOnMount: false, refetchInterval: 10_000}
	)
	return <PokemonView {...query} />
}
function CategoriesUseQueryCustom() {
	const query = useQueryCustom(
		api.getCategories, [],
		{refetchOnMount: false, refetchInterval: 10_000}
	)
	const logClickM = useMutationCustom((id: number) => api.logClick({id}))
	const onClick = useCallback(onClickCb, [])
	return <CategoriesView {...query} onClick={onClick} />
	
	function onClickCb(e: any, category: Category) {
		e.preventDefault()
		logClickM.mutate(category.id)
	}
}
function CategoryUseQueryCustom({id}: {id: number}) {
	const query = useQueryCustom(
		api.getCategory,
		[{id}],
		{refetchOnMount: false, refetchInterval: 10_000}
	)
	const logClickM = useMutationCustom((id: number) => api.logClick({id}))
	const onClick = useCallback(onClickCb, [])
	return <CategoryView {...query} onClick={onClick} />
	
	function onClickCb(e: any, category: Category) {
		e.preventDefault()
		logClickM.mutate(category.id)
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
