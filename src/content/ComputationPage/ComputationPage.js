import { Button, Column, Grid, Row, ClickableTile, AspectRatio } from 'carbon-components-react'
import { React, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import API from '../../components/API.tsx'
// import HEKAReaderPy from './HEKAReaderPy'

// const handlePython = async () => {
//     console.log(window.pyodide.runPythonAsync(HEKAReaderPy));
// }

const ComputationPage = () => {

    const history = useHistory()

    const [computations, setComputations] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        API.getComputations(setComputations, {}, setLoading)
    }, [])



    // useEffect(() => {
    //     const loadPyodide = async () => {
    //         await window.loadPyodide({
    //             indexURL : process.env.PUBLIC_URL + "/pyodide/"
    //         })
    //     }

    //     loadPyodide()
    // }, [])

    if (loading) return <p>Loading...</p>

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
        <Row>
            <Column>
                <Button onClick={() => history.push('/computations/image-test')}>Go to Image Classification Test</Button>
            </Column>
        </Row>
        {/* <Row>
            <Column>
                <h1>Python Code Test</h1>
                <Button onClick={() => handlePython()}>Run Program</Button>
            </Column>
        </Row> */}
    </Grid>
}

export default ComputationPage