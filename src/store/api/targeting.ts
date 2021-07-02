import { miniSerializeError } from '@reduxjs/toolkit'
import { createApi } from '@reduxjs/toolkit/query/react'

import getClient from '../../services/targeting'

type Client = ReturnTypeP<typeof getClient>
interface TargetingBaseQueryArgs<P extends Record<string,any>> {method: keyof Client, params: P}

export const targetingApi = createApi({
	reducerPath: 'targetingApi',
	baseQuery: targetingServiceBaseQuery,
	tagTypes: ['Category'],
	endpoints: (builder) => ({
		getCategory: builder.query<ReturnTypeP<Client['getCategory']>, Parameters<Client['getCategory']>[0]>({
			query: (params) => ({method: 'getCategory', params}),
			providesTags: ['Category'],
			// transformResponse: (response: ReturnTypeP<Client['getCategory']>) => ({...response, tagUpperCase: response.tag.toUpperCase()}),
		}),
		getCategories: builder.query<ReturnTypeP<Client['getCategories']>, Parameters<Client['getCategories']>[0]>({
			providesTags: ['Category'],
			query: (params) => ({method: 'getCategories', params}),
		}),
		updateCategory: builder.mutation<ReturnTypeP<Client['updateCategory']>, Parameters<Client['updateCategory']>[0]>({
			query: (params) => ({method: 'updateCategory', params}),
			invalidatesTags: ['Category'],
		}),
		logClick: builder.mutation<ReturnTypeP<Client['logClick']>, Parameters<Client['logClick']>[0]>({
			query: (params) => ({method: 'logClick', params}),
			invalidatesTags: ['Category'],
		}),
	}),
	keepUnusedDataFor: 6000,
	refetchOnMountOrArgChange: 2,
	refetchOnFocus: false,
	refetchOnReconnect: false,
})

export const {
	useGetCategoryQuery,
	useGetCategoriesQuery,
	useUpdateCategoryMutation,
	useLogClickMutation,
} = targetingApi


async function targetingServiceBaseQuery(args: TargetingBaseQueryArgs<any>) {
	const client = await getClient()
	const metadata = null
	try {
		const res = await client[args.method](args.params, metadata)
		return { data: res }
	} catch(e) {
		return { error: miniSerializeError(e) }
	}
}