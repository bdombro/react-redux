import React, {useState} from 'react'

import QueryHooksDemo from './demos/QueryHooksDemo'
import ReactQueryDemo from './demos/ReactQueryDemo'
import RtkDemo from './demos/RtkDemo'
import SliceDemo from './demos/SliceDemo'

export default function App() {
	const [fetchLib, setFetchLib] = useState<string>('')
	return (
		<div style={{ margin: 50}}>
			<b>DEMO</b>: <select value={fetchLib} onChange={v => setFetchLib(v.target.value)}>
				<option disabled value=''> -- select an option -- </option>
				<option value='Slices'>Redux Toolkit Slices</option>
				<option value='RTK'>Redux Toolkit RTK</option>
				<option value='react-query'>react-query</option>
				<option value='query-hooks'>query-hooks</option>
			</select>
			{
				fetchLib === '' && <></>
				|| fetchLib === 'Slices' && <SliceDemo />
				|| fetchLib === 'RTK' && <RtkDemo />
				|| fetchLib === 'react-query' && <ReactQueryDemo />
				|| fetchLib === 'query-hooks' && <QueryHooksDemo />
				|| <>Error: Unknown Selection</>
			}
		</div>
	)
}
