import { Column, Grid, Row, ClickableTile, AspectRatio } from 'carbon-components-react'
import { useHistory } from 'react-router-dom'

import {useFetch} from '../../components/Hooks.tsx'
import PageHeader from '../../components/PageHeader'
import PageSection from '../../components/PageSection/PageSection'

const ComputationPage = () => {

    const history = useHistory()
    const {loading, data} = useFetch([{url: 'getComputations'}])
    const computations = data.getComputations

    if (loading) return <p>Loading...</p>
    if (!computations) return <p>Error!</p>

    return <Grid>
        <PageHeader pageTitle="Computations" description="Manage your saved computations."/>
        
        <PageSection title="Stored computations" description="List of your saved computations." />

        <Row>
            {computations.map(computation => <Column sm={2} md={4} lg={4} max={3}>
            <ClickableTile handleClick={() => history.push('/computation/' + computation.name)}>
                <AspectRatio ratio="1x1">
                    <h4>{computation.friendlyName}</h4>
                    <br />
                    <p>{computation.description}</p>


                </AspectRatio>
            </ClickableTile>
            </Column>)}

        </Row>

        <PageSection title="History" description="View historical results to your computations" />
        <PageSection title="Manage" description="Manage your saved computations" />
    </Grid>
}

export default ComputationPage