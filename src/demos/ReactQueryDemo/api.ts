import * as apiBase from '#src/api'

import { queryClient } from './react-query'

export const cacheKeys = {
	category: 'category'
} as const

const updateCategory: typeof apiBase.updateCategory = params => {
	const res = apiBase.updateCategory(params)
	queryClient.invalidateQueries(cacheKeys.category)
	return res
}

const logClick: typeof apiBase.logClick = params => {
	const res = apiBase.logClick(params)
	queryClient.invalidateQueries(cacheKeys.category)
	return res
}

export default {
	...apiBase,
	updateCategory,
	logClick,
	cacheKeys,
}
