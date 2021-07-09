import React, {useEffect, useRef, useState} from 'react'

import type { Category } from '#services/targeting'

export default function CategoryDetail({
	data,
	error,
	isLoading,
	onClick
}: {
	data?: Category,
	error?: any,
	isLoading: boolean,
	onClick(category: Category): any
}) {
	const clickStart = useRef(0)
	const clickCountLast = useRef(0)
	const [renderDelay, setRenderDelay] = useState(0)
	useEffect(watchForRenderSettle, [data])

	return (
		<div>
			{isLoading ? (
				<>Loading...</>
			)	: data !== undefined ? (
				<div>
					Category: <a href="#click-category" onClick={e => onClickInner(e, data)}>{data.tag}</a>{' '}
							- Clicks: {data.clickCount} - Time from click to render settle: {renderDelay}ms
				</div>
			) : (
				<>Error: {error?.message || 'unknown'}</>
			)}
		</div>
	)

	function onClickInner(e: any, category: Category) {
		e.preventDefault()
		clickStart.current = Date.now()
		onClick(category)
	}

	function watchForRenderSettle() {
		if (data?.clickCount && data.clickCount !== clickCountLast.current) {
			if (data.clickCount == clickCountLast.current + 1)
				setRenderDelay(Date.now() - clickStart.current)
			clickCountLast.current = data.clickCount
		}
	}

	
}
