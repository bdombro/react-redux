import { AbstractInstanceType, Resource, RestEndpoint, SchemaDetail, SchemaList } from '@rest-hooks/rest'

import * as api from '#src/api'
import type { Category } from '#src/services/targeting'

export default class CategoryResource extends Resource {
	readonly id: number = 0;
	readonly tag: string = ''
	readonly clickCount: number = 0
	// readonly author: number | null = null;
	// readonly tags: string[] = [];

	pk() {return this.id?.toString()}

	static urlRoot = 'http://test.com/article/';

	/**
	 * Extend standard detail and list so that they use GRPC instead of fetch
	 */

	static detail<T extends typeof Resource>(this: T) : RestEndpoint<
    (this: RestEndpoint, params: {id:number}) => Promise<any>,
    SchemaDetail<AbstractInstanceType<T>>,
    undefined
  > {
		return super.detail().extend({
			fetch(params: Readonly<{id:number}>, body?: Readonly<any | string>) {
				return api.getCategory(params)
			},
		})
	}

	static list<T extends typeof Resource>(this: T) : RestEndpoint<
    (this: RestEndpoint, params: any) => Promise<any>,
    SchemaList<AbstractInstanceType<T>>,
    undefined
  > {
		return super.list().extend({
			fetch(params: Readonly<any>, body?: Readonly<any | string>) {
				return api.getCategories(params)
			},
		})
	}

	static partialUpdate<T extends typeof Resource>(this: T): RestEndpoint<
    (this: RestEndpoint, params: any, body: any) => Promise<any>,
    SchemaDetail<AbstractInstanceType<T>>,
    true
  > {
		return super.partialUpdate().extend({
			// optimisticUpdate: (params: any, body: any) => return ({
			// 	id: params.id,
			// 	...body,
			// }),
			fetch(params: Readonly<{id: number} & Partial<Category>>, body?: Readonly<any | string>) {
				return api.updateCategory(params)
			},
		})
	}

	static logClick<T extends typeof Resource>(this: T): RestEndpoint<
			(this: RestEndpoint, params: {id:number}, body: any) => Promise<any>,
			SchemaDetail<AbstractInstanceType<T>>,
			true
		> {
		return super.partialUpdate().extend({
			fetch(params: Readonly<{id:number}>, body?: Readonly<any | string>) {
				return api.logClick(params)
			},
		})
	}
}