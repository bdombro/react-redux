import { throwError } from '../Errors'

/**
 * A client that immitates a typical Grpc client as generated by protoc-gen-grpc-web
 */
export default async function getClient() {
	return {
		getCategories,
		getCategory,
		updateCategory,
		logClick,
	}
}

async function getCategories(params: Record<string, never>, metadata: any) {
	console.log(`${getFncName()} was called`)
	return categories
}

async function getCategory({id}: {id: Category['id']}, metadata: any) {
	console.log(`${getFncName()} was called`)
	return categories.find(c => c.id === id) || throwError('404: Category not found')
}

async function updateCategory({id, ...updates}: Partial<Category> & Pick<Category, 'id'>, metadata: any) {
	console.log(`${getFncName()} was called`)
	categories = categories.map(o => ({...o})) // hack bc somehow categories becomes immutable
	const category = categories.find(c => c.id === id) || throwError('404: Category not found')
	Object.assign(category, updates)
	return category
}

async function logClick({id}: {id: Category['id']}, metadata: any) {
	console.log(`${getFncName()} was called`)
	categories = categories.map(o => ({...o})) // hack bc somehow categories becomes immutable
	const category = categories.find(c => c.id === id) || throwError('404: Category not found')
	category.clickCount++
	return category
}

interface Category {
	id: number
	tag: string
	clickCount: number
}

let categories: Category[] = [
	{
		id: 0,
		tag: 'automotive',
		clickCount: 0,
	},
	{
		id: 1,
		tag: 'auto-body-styles',
		clickCount: 0,
	},
]

function getFncName() {
	const stackLine = (new Error())!.stack!.split('\n')[2].trim()
	const fncName = stackLine.match(/at Object.([^ ]+)/)![1]
	return fncName
}