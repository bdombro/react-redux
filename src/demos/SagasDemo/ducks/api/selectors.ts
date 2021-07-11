import type {RootState} from '../../store'

export const getCategories = (state: RootState) =>
	state.api.categories
