import React from 'react'

import type { Category } from '#services/targeting'

export default function CategoryList({
	data,
	error,
	isLoading
}: {
	data?: readonly Category[],
	error?: any,
	isLoading: boolean,
}) {
	return (
		<div>
			<h4>Category Click Counts</h4>
			{isLoading ? (
				<>Loading...</>
			)	: data !== undefined ? (
				<ol>
					{data.map(c => (
						<li key={c.id}>
							{c.tag} / Clicks: {c.clickCount}
						</li>
					))}
				</ol>
			) : (
				<>Error: {error?.message || 'unknown'}</>
			)}
		</div>
	)
}
