import React from 'react'

export default function PokemonDetail({
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
