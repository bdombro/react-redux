import React, {useCallback} from 'react'

import type { Category as CategoryType } from '#services/targeting'
import * as baseComponents from '#src/components'

import api from './api'
import {useMutation, useQuery} from './query-hooks'

export default function QueryHooksDemo() {
	return <div>
		<p style={{maxWidth: 500}}>
				A smart, custom fetch hook lib similar to react-query.{' '}
				Notice how these components share a fetch despite mounting simultaneously, aka race-de-duping</p>
		<h3>Rest Example</h3>
		<p>Bundle Size: 2kb mini+gz</p>
		<Pokemon nameSlug={'pikachu'} />
		<Pokemon nameSlug={'pikachu'} />
		<h3>GRPC-Web Example</h3>
		<Categories />
		<Categories />
		<Category id={0} />
		<Category id={1} />
	</div>
}

function Pokemon({nameSlug}: {nameSlug: string}) {
	const query = useQuery(
		api.getPokemonByName,
		[nameSlug],
		{refetchOnMount: false, refetchInterval: 10_000}
	)
	return <baseComponents.PokemonDetail {...query} />
}

function Categories() {
	const query = useQuery(
		api.getCategories, [],
		{refetchOnMount: false, refetchInterval: 10_000}
	)
	return <baseComponents.CategoryList {...query} />
}

function Category({id}: {id: number}) {
	const query = useQuery(
		api.getCategory,
		[{id}],
		{refetchOnMount: false, refetchInterval: 10_000}
	)
	const logClickM = useMutation((id: number) => api.logClick({id}))
	const onClick = useCallback(onClickCb, [])
	return <baseComponents.CategoryDetail {...query} onClick={onClick} />
	
	function onClickCb(category: CategoryType) {
		logClickM.mutate(category.id)
	}
}

