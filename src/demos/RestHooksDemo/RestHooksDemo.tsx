import {useStatefulResource} from '@rest-hooks/legacy'
import React, {Suspense, useCallback, useMemo} from 'react'
import { CacheProvider, NetworkErrorBoundary, useFetcher } from 'rest-hooks'

import type { Category as CategoryType } from '#services/targeting'
import * as baseComponents from '#src/components'

import CategoryResource from './resources/CategoryResource'
import PokemonResource from './resources/PokemonResource'

export default function RestHooksDemo() {
	return (
		<CacheProvider>
			<div>
				<p style={{maxWidth: 500}}>
				A popular model-based fetch hook lib.{' '}
				In contrast to the url-based caches, this lib caches at the model level, thereby enabling deeper caching and offline capabilities.</p>
				<p>Bundle Size: 10kb mini+gz</p>
				<NetworkErrorBoundary>
					<h3>Rest Example</h3>
					<Pokemon nameSlug={'pikachu'} />
					<Pokemon nameSlug={'pikachu'} />
					<h3>GRPC-Web Example</h3>
					{/* <Categories />
					<Categories /> */}
					<CategoriesFiltered/>
					<Category id={0} />
					<Category id={1} />
				</NetworkErrorBoundary>
			</div>
		</CacheProvider>
	)
}


function Pokemon({nameSlug}: {nameSlug: string}) {
	const pokemonQ = useStatefulResource(PokemonResource.detail(), {name: nameSlug})
	const query = useMemo(() => ({
		...pokemonQ,
		data: pokemonQ.data as unknown as Pokemon,
		isLoading: pokemonQ.loading,
	}), [pokemonQ])
	return <baseComponents.PokemonDetail {...query} />
}

function Categories() {
	const categories = useStatefulResource(CategoryResource.list(), {})
	const query = useMemo(() => ({
		...categories,
		isLoading: categories.loading,
	}), [categories])
	return <baseComponents.CategoryList {...query} />
}

function CategoriesFiltered() {
	const categoriesQ = useStatefulResource(CategoryResource.list(), {where: {field: 'id', op: 'in', params: [0]}})
	const query = useMemo(() => ({
		...categoriesQ,
		isLoading: categoriesQ.loading,
	}), [categoriesQ])
	return <baseComponents.CategoryList {...query} />
}

function Category({id}: {id: number}) {
	const categoryQ = useStatefulResource(CategoryResource.detail(), {id})
	const query = useMemo(() => ({
		...categoryQ,
		isLoading: categoryQ.loading,
	}), [categoryQ])

	const logClickM = useFetcher(CategoryResource.logClick())
	const onClick = useCallback(onClickCb, [])
	
	return <baseComponents.CategoryDetail {...query} onClick={onClick} />
	
	function onClickCb(category: CategoryType) {
		logClickM({id: category.id})
	}
}
