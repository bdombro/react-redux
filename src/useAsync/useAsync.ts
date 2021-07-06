import { useCallback, useEffect, useMemo, useState } from 'react'
import { useUpdateEffect } from 'react-use'

/**
 * Hookifies a fetcher callback function with typesafety, helpful options, smart caching
 * and race de-duping
 *
 * Race de-duping: If multiple components use the hook with the same props at the same time,
 * useAync will only call the fetcher once and return the response to both components
 *
 * @param fetcher - an async function that returns data. Supports fetchers that throw errors or return an Error
 * @param options - options for the hook: mode and pollInterval
 * @param params - rest parameters to pass to fetcher
 *
 * Ex.
 *   const getUsers  = async () => {const c = new GrpcClient(); c.searchUsers({page, pageSize})
 *   const getUsers2 = async (page: number, pageSize: number) => {const c = new GrpcClient(); c.searchUsers({page, pageSize})
 *
 *   function MyComponent() {
 *     const users1 = useAsync(getUsers) // no type error
 *     const users2 = useAsync(getUsers, {}) // no type error
 *     const users3 = useAsync(getUsers, {mode: 'noCache'}) // no type error
 *     const users4 = useAsync(getUsers, {}, 1, 10) // type error unexpected args
 *
 *     const users5 = useAsync(getUsers2) // type error missing args page and pageSize
 *     const users6 = useAsync(getUsers2, {}) // type error missing args page and pageSize
 *     const users7 = useAsync(getUsers2, {mode: 'noCache'}) // type error missing args page and pageSize
 *     const users8 = useAsync(getUsers2, {}, 1, 10) // no type error
 *   }
 */
export default function useAsync<
	FetcherShape extends (...props: any) => Promise<any>
>(
	// Fetcher function to use
	fetcher: FetcherShape,
	// Hook options: mode and pollInterval
	options: { mode?: HookModesType; pollInterval?: number } = {},
	// rest parameters to pass to the fetcher function
	...params: Parameters<FetcherShape>
) {
	type ResponseShape = ThenArg<ReturnType<FetcherShape>>;
	type ResponseShapeNoError = Exclude<ResponseShape, Error>;

	const { cache, modes } = useAsync

	const { mode = modes.staleWhileRefresh, pollInterval } = options

	const cacheKey = useMemo(
		() => `${fetcher.name}-${fastHash(fetcher.toString())}-${fastHash(JSON.stringify(params))}`,
		[...params],
	)

	const refetchCb = useCallback(fetcherWithRaceDedup, [fetcherWithRaceDedup])

	const [state, setState] = useState<HookState<ResponseShapeNoError>>(
		initialize,
	)
	const [paramState, setParamState] = useState({params, version: 0})

	useEffect(watchParams, [...params])
	useEffect(subscribe, [paramState])
	useEffect(poll, [mode])
	useUpdateEffect(() => {initialize()}, [paramState])

	return state

	function watchParams() {
		if (JSON.stringify(paramState.params) !== JSON.stringify(params))
			setParamState(last => ({params, version: last.version+1}))
	}
	
	function subscribe() {
		const hit = cache.get(cacheKey)!
		const key = Math.max(0, ...Array.from(hit?.subscribers.keys() ?? [])) + 1
		hit?.subscribers.set(key, () => {
			const latest = cache.get(cacheKey)!
			latest.fetchP
				?.then(result => {
					if (JSON.stringify(result) !== JSON.stringify(state.data))
						setState({
							isLoading: false,
							data: result,
							error: undefined,
							refetch: refetchCb,
						})
					return result
				})
				?.catch(error => {
					if (JSON.stringify(error) !== JSON.stringify(state.error))
						setState({
							isLoading: false,
							data: undefined,
							error,
							refetch: refetchCb,
						})
					return error
				})
		})
		cache.set(cacheKey, hit)
		return () => {
			const hit = cache.get(cacheKey)
			hit?.subscribers.delete(key)
		}
	}

	/**
	 * Calculate the initial state and trigger fetch
	 */
	function initialize(): HookState<ResponseShapeNoError> {
		let hit = cache.get(cacheKey)

		if (!hit) {
			hit = {
				fetching: true,
				fetchP: undefined,
				value: undefined,
				time: 0,
				subscribers: new Map(),
				refetch: () => fetcherWithRaceDedup(),
			}
			cache.set(cacheKey, hit)
		}

		const cacheAllowed = [
			modes.vivaLaCache,
			modes.staleWhileRefresh,
		].includes(mode as any)

		const initialState =
			hit?.value && cacheAllowed
				? {
					isLoading: false,
					data: hit.value,
					error: undefined,
					refetch: refetchCb,
				}
				: {
					isLoading: true,
					data: undefined,
					error: undefined,
					refetch: refetchCb,
				}

		const alwaysRefetch = [modes.staleWhileRefresh, modes.noCache].includes(
			mode as any,
		)

		if (hit?.value === undefined || alwaysRefetch) fetcherWithRaceDedup()

		return initialState
	}

	/**
	 * Wraps fetcher with race de-duping handling
	 *
	 * For example, If multiple components use the hook with the same props at the same time,
	 * useAync will only call the fetcher once and return the response to both components
	 */
	function fetcherWithRaceDedup() {
		const hit = cache.get(cacheKey)

		if (hit?.fetchP && hit?.value && Date.now() - hit?.time < 50)
			return hit.fetchP

		// If already fetching (aka race duplicate), return the existing promise
		// Otherwise trigger the fetch in background
		if (hit?.fetchP && hit?.fetching)
			return hit.fetchP

		const fetchP = fetcher(...(params as any))

		// Set the cache to be aware that a fetch is in progress
		cache.set(cacheKey, {
			fetching: true,
			fetchP: fetchP,
			value: hit?.value,
			time: hit?.time ?? 0,
			subscribers: hit?.subscribers ?? new Map(),
			refetch: () => fetcherWithRaceDedup(),
		})

		// Update the state and cache once the fetch has completed
		fetchP
			.then(result => {
				const hit2 = cache.get(cacheKey)!
				cache.set(cacheKey, {
					...hit2,
					fetching: false,
					value: result,
					error: undefined,
					time: Date.now(),
				})
				hit2.subscribers.forEach(cb => cb())
				return result
			})
			.catch(error => {
				const hit2 = cache.get(cacheKey)!
				cache.set(cacheKey, {
					...hit2,
					fetching: false,
					value: undefined,
					error,
					time: Date.now(),
				})
				hit2.subscribers.forEach(cb => cb())
				return error
			})

		return fetchP
	}

	/**
	 * If pollInterval specified, refetch in that interval with race handling
	 */
	function poll() {
		if (pollInterval) {
			const interval = setInterval(() => {
				const hit = cache.get(cacheKey) || {
					fetching: false,
					value: undefined,
					time: 0,
				}
				if (Date.now() - hit.time > pollInterval) fetcherWithRaceDedup()
			}, pollInterval)
			return () => clearInterval(interval)
		}
		return () => {}
	}
}

interface HookState<ResponseShape> {
	isLoading: boolean;
	data?: ResponseShape;
	error?: Error;
	refetch(): Promise<ResponseShape>;
}

useAsync.modes = {
	// On mount, will return cache and not refetch if cache is available
	vivaLaCache: 'vivaLaCache',
	// Will never return cache
	noCache: 'noCache',
	// Will return cache, refetch in background, and re-render. See https://web.dev/stale-while-revalidate/
	staleWhileRefresh: 'staleWhileRefresh',
	// Will remain in loading state until refetch is manually called
	lazy: 'lazy',
} as const
type HookModesType =
	| typeof useAsync.modes.vivaLaCache
	| typeof useAsync.modes.noCache
	| typeof useAsync.modes.staleWhileRefresh
	| typeof useAsync.modes.lazy

useAsync.cache = new Map<
	string,
	{
		fetching: boolean
		fetchP: Promise<any> | undefined
		value: any
		error?: Error
		time: number
		subscribers: Map<number, () => any>
		refetch(): Promise<any>
	}
>();
(function cacheGarbageCollect() {
	const maxAge = 10 * 60 * 1000
	setInterval(() => {
		const now = Date.now()
		useAsync.cache.forEach((value, key, map) => {
			if (now - value.time > maxAge) map.delete(key)
		})
	}, maxAge / 2 + 1)
})()

useAsync.clearCache = function (prefixes: string[]) {
	Array.from(useAsync.cache.keys())
		.filter(k => prefixes.some(p => k.startsWith(p)))
		.forEach(k => useAsync.cache.get(k)?.refetch())
}

/**
 * Converts a string into a semi-unique, numeric hash
 *
 * Compared to other hash algs (MD5), is much simpler, faster while less perfect
 * Src: https://stackoverflow.com/a/8831937/1202757
 */
function fastHash(str: string) {
	return Array.from(str).reduce(
		(hash, char) => 0 | (31 * hash + char.charCodeAt(0)),
		0,
	)
}
