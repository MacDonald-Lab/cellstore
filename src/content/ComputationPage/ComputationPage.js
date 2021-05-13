import { Button, Column, Grid, Row } from 'carbon-components-react'
import { React } from 'react'
import {useHistory} from 'react-router-dom'

const ComputationPage = () => {
    
    const history = useHistory()

    return <Grid>
        <Row>
            <Column>
                <h1>Computation Centre</h1>
                <br />
                <br />
            </Column>
        </Row>
        <Row>
            <Column>
                <Button onClick={() => history.push('/computations/image-test')}>Go to Image Classification Test</Button>
            </Column>
        </Row>
    </Grid>
}

export default ComputationPage