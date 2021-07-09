import {useLayoutEffect, useMemo} from 'react'
import { TypedUseSelectorHook, useDispatch as useDispatchR, useSelector as useSelectorR } from 'react-redux'
import {useUpdateEffect} from 'react-use'
import type { RootState, AppDispatch } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useDispatch = () => useDispatchR<AppDispatch>()
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorR

export function useSagaSelector<S extends FunctionType>(
	action: FunctionType,
	selector: S,
	options: {
		refetchOnMount?: boolean
		refetchInterval?: number
	} = {}
): ReturnType<S> {
	const {refetchOnMount = true, refetchInterval} = options
	const dispatch = useDispatch()
	const current = useSelector(selector)
	const actionSignature = useMemo(
		() => `${action.name}-${fastHash(action.toString())}`,
		[selector]
	)

	useLayoutEffect(() => {
		const wasLastCalledAt = sagaActionLastCalledAt.get(actionSignature) || 0
		const isBounce = Date.now() - wasLastCalledAt < 400
		if (
			!wasLastCalledAt
			|| (!isBounce && refetchOnMount)
		) {
			sagaActionLastCalledAt.set(actionSignature, Date.now())
			dispatch(action());
		}

		if (refetchInterval) {
			const i = setInterval(() => {
				const wasLastCalledAt = sagaActionLastCalledAt.get(actionSignature) || 0
				const isBounce = Date.now() - wasLastCalledAt < 400
				if (!isBounce) {
					sagaActionLastCalledAt.set(actionSignature, Date.now())
					dispatch(action());
				}
			}, refetchInterval)
			return () => clearInterval(i)
		}
  }, [dispatch]);

	return current
}

const sagaActionLastCalledAt = new Map<string, number>()
type FunctionType = (...args: any) => any

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