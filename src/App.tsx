import React, {useState} from 'react'

import QueryHooksDemo from './demos/QueryHooksDemo'
import ReactQueryDemo from './demos/ReactQueryDemo'
import RestHooksDemo from './demos/RestHooksDemo'
import RtkDemo from './demos/RtkDemo'
import SagasDemo from './demos/SagasDemo'
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
				<option value='rest-hooks'>rest-hooks</option>
				<option value='query-hooks'>query-hooks</option>
				<option value='saga'>Redux Saga</option>
			</select>
			{
				fetchLib === '' && <></>
				|| fetchLib === 'Slices' && <SliceDemo />
				|| fetchLib === 'RTK' && <RtkDemo />
				|| fetchLib === 'react-query' && <ReactQueryDemo />
				|| fetchLib === 'rest-hooks' && <RestHooksDemo />
				|| fetchLib === 'query-hooks' && <QueryHooksDemo />
				|| fetchLib === 'saga' && <SagasDemo />
				|| <>Error: Unknown Selection</>
			}
		</div>
	)
}
