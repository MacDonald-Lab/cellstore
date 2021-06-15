import { Column, Grid, Row, ClickableTile, AspectRatio } from 'carbon-components-react'
import { useHistory } from 'react-router-dom'

import {useFetch} from '../../components/Hooks.tsx'

const ComputationPage = () => {

    const history = useHistory()
    const {loading, data} = useFetch([{url: 'getComputations'}])
    const computations = data.getComputations

    if (loading) return <p>Loading...</p>
    if (!computations) return <p>Error!</p>

    return <Grid>
        <Row>
            <Column>
                <h1>Computations</h1>
                <br />
                <br />
            </Column>
        </Row>

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
    </Grid>
}

export default ComputationPage