import { getClient } from '../../services/targeting'
import useAsync from '../useAsync'

/**
 * GRPC Helper functions
 */

export function clearCache () {
	useAsync.clearCache([getCategories.name, getCategory.name])
}
export async function getCategories(params: Parameters<ReturnTypeP<typeof getClient>['getCategories']>[0]) {
	const client = await getClient()
	return client.getCategories(params)
}
export async function getCategory(params: Parameters<ReturnTypeP<typeof getClient>['getCategory']>[0]) {
	const client = await getClient()
	return client.getCategory(params)
}
export async function updateCategory(params: Parameters<ReturnTypeP<typeof getClient>['updateCategory']>[0]) {
	const client = await getClient()
	const res = client.updateCategory(params)
	clearCache()
	return res
}
export async function logClick(params: Parameters<ReturnTypeP<typeof getClient>['logClick']>[0]) {
	const client = await getClient()
	const res = client.logClick(params)
	clearCache()
	return res
}