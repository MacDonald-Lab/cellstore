import { Column, Grid, Row } from 'carbon-components-react'
import { React } from 'react'

import tigerImage from './tiger.jpg'

const ImageClassificationTestPage = () => {

    return <Grid>
        <Row>
            <Column>
                <h1>Image Classification Test</h1>
                <br />
                <br />
            </Column>
        </Row>
        <Row>
            <Column sm={4} md={4} lg={4}>
                <h3>Sample Image</h3>
                <br />
                <img src={tigerImage} width={'100%'} />
            </Column>
        </Row>
    </Grid>



}

export default ImageClassificationTestPage