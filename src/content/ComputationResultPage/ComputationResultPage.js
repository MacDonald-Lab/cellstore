import {Grid} from 'carbon-components-react'
import PageHeader from '../../components/PageHeader'
import PageSection from '../../components/PageSection/PageSection'


const ComputationResultPage = ({location}) => {
    const { state } = location
    if (!state) return <p>No data found</p>

    return <Grid>
        <PageHeader pageTitle='Computation Result' />
        
        {Object.keys(state).map(key => 
        <PageSection key={key} title={key} description={state[key]} />
        )}

    </Grid>

}

export default ComputationResultPage