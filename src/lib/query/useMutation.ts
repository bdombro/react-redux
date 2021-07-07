import {useCallback, useState} from 'react'

export default function useMutation<
	MutatorShape extends PromiseFnc
>(
	// Mutator function to use
	mutator: MutatorShape,
	events: {
		onCall?: () => any
		onSuccess?: (res: ThenArg<ReturnType<MutatorShape>>) => any
		onError?: (error: Error) => any
	} = {},
) {

	const mutateCb = useCallback(mutate, [mutator])

	const [state, setState] = useState<HookState<MutatorShape>>({
		mutate: mutateCb,
		isLoading: false,
		data: undefined,
		error: undefined,
	})
	return state

	async function mutate(...params: Parameters<MutatorShape>): Promise<ThenArg<ReturnType<MutatorShape>>> {
		if (state.isLoading)
			throw new Error('Cannot call mutation while prior call is still running')
		setState({
			mutate: mutateCb,
			isLoading: true,
			data: undefined,
			error: undefined,
		})
		events.onCall?.()
		const res = 
			await mutator(...params)
				.then(async res => {
					setState({
						mutate: mutateCb,
						isLoading: false,
						data: res,
						error: undefined,
					})
					events.onSuccess?.(res)
					return res
				})
				.catch(error => {
					setState({
						mutate: mutateCb,
						isLoading: false,
						data: undefined,
						error,
					})
					events.onError?.(error)
					throw Error(error)}
				)
		return res
	}
}

interface HookState<MutatorShape extends PromiseFnc> {
	mutate(...params: Parameters<MutatorShape>): Promise<ThenArg<ReturnType<MutatorShape>>>
	isLoading: boolean
	data?: MutatorShape
	error?: Error
}