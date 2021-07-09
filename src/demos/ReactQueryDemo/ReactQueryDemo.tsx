import React, {useCallback} from 'react'

import type { Category as CategoryType } from '#services/targeting'
import * as baseComponents from '#src/components'

import api from './api'
import { queryClient, QueryClientProvider, useMutation as useMutationRq, useQuery as useQueryRq } from './react-query'

export default function ReactQueryDemo() {
	return (
		<QueryClientProvider client={queryClient}>
			<div>
				<p style={{maxWidth: 500}}>
				A popular fetch hook lib.{' '}
				Notice how these components share a fetch despite mounting simultaneously, aka race-de-duping</p>
				<p>Bundle Size: 11.6kb mini+gz</p>
				<h3>Rest Example</h3>
				<Pokemon nameSlug={'pikachu'} />
				<Pokemon nameSlug={'pikachu'} />
				<h3>GRPC-Web Example</h3>
				<Categories />
				<Categories />
				<Category id={0} />
				<Category id={1} />
			</div>
		</QueryClientProvider>
	)
}

function Pokemon({nameSlug}: {nameSlug: string}) {
	const query = useQueryRq(
		['getPokemonByName', nameSlug],
		() => api.getPokemonByName(nameSlug),
		{refetchOnMount: false, refetchInterval: 10_000},
	)
	return <baseComponents.PokemonDetail {...query} />
}

function Categories() {
	const query = useQueryRq(
		api.cacheKeys.category,
		() => api.getCategories(),
		{refetchOnMount: false, refetchInterval: 10_000},
	)
	return <baseComponents.CategoryList {...query} />
}

function Category({id}: {id: number}) {
	const query = useQueryRq(
		[api.cacheKeys.category, id],
		() => api.getCategory({id}),
		{refetchOnMount: false, refetchInterval: 10_000},
	)
	const logClickM = useMutationRq((id: number) => api.logClick({id}))
	const onClick = useCallback(onClickCb, [])
	return <baseComponents.CategoryDetail {...query} onClick={onClick} />
	function onClickCb(category: CategoryType) {
		logClickM.mutate(category.id)
	}
}
