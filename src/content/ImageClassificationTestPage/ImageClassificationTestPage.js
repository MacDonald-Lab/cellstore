import { Button, Column, Grid, Row, StructuredListCell, StructuredListWrapper, StructuredListRow, StructuredListHead } from 'carbon-components-react'
import { React, useState } from 'react'

import classificationImage from './image.jpg'
import { imageClassifier } from 'ml5'



const ImageClassificationTestPage = () => {

    const [predictions, setPredictions] = useState([])

    const classifyImage = () => {

        const classifier = imageClassifier('MobileNet', () => {
            console.log('Model loaded')
        })

        const image = document.getElementById('image')

        classifier.predict(image, 5, (err, result) => {
            if (err) return err
            return result
        }).then(result => setPredictions(result))
    }

    const PredictionView = () => {
        if (predictions.length === 0) return <Button onClick={() => classifyImage()}>Classify Image</Button>
        return <StructuredListWrapper>
            <StructuredListHead>
                <StructuredListRow head>
                    <StructuredListCell head>Identification</StructuredListCell>
                    <StructuredListCell head>Confidence</StructuredListCell>
                </StructuredListRow>
            </StructuredListHead>
            {predictions.map((prediction, i) => <StructuredListRow key={i}>
                <StructuredListCell>{prediction.label}</StructuredListCell>
                <StructuredListCell>{prediction.confidence}</StructuredListCell>
            </StructuredListRow>)}

        </StructuredListWrapper>
    }


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
                <img src={classificationImage} id='image' alt='A tiger in the wild' width={'100%'} />
            </Column>
            <Column>
            <PredictionView />
                
            </Column>
        </Row>
    </Grid>



}

export default ImageClassificationTestPage