import * as apiBase from '#src/api'

import { useQuery } from './query-hooks'

const updateCategory: typeof apiBase.updateCategory = params => {
	const res = apiBase.updateCategory(params)
	useQuery.invalidateQueries([apiBase.getCategories.name, apiBase.getCategory.name])
	return res
}

const logClick: typeof apiBase.logClick = params => {
	const res = apiBase.logClick(params)
	useQuery.invalidateQueries([apiBase.getCategories.name, apiBase.getCategory.name])
	return res
}

export default {
	...apiBase,
	updateCategory,
	logClick,
}
