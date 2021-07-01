import React from 'react'
import { useDispatch,useSelector } from 'react-redux'

import { useGetPokemonByNameQuery } from './api'
import { decrement, increment } from './slices/counterSlice'
import type { RootState } from './store'

export default function App() {
	return (
		<div style={{textAlign: 'center', margin: 50}}>
			<CounterComponent />
			<PokemonComponent nameSlug={'bulbasaur'} />
			<PokemonComponent nameSlug={'pikachu'} />
			<PokemonComponent nameSlug={'pikachu'} />
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
	const { data, error, isLoading } = useGetPokemonByNameQuery(nameSlug)

	return (
		<div>
			{error ? (
				<>Oh no, there was an error</>
			) : isLoading ? (
				<>Loading...</>
			) : data ? (
				<>
					<h3>{data.species.name}</h3>
					<img src={data.sprites.front_shiny} alt={data.species.name} />
				</>
			) : null}
		</div>
	)
}