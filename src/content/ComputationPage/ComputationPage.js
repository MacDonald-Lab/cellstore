import { Button, Column, Grid, Row } from 'carbon-components-react'
import { React } from 'react'
import { useHistory } from 'react-router-dom'
// import HEKAReaderPy from './HEKAReaderPy'

// const handlePython = async () => {
//     console.log(window.pyodide.runPythonAsync(HEKAReaderPy));
// }

const ComputationPage = () => {

    const history = useHistory()

    // useEffect(() => {
    //     const loadPyodide = async () => {
    //         await window.loadPyodide({
    //             indexURL : process.env.PUBLIC_URL + "/pyodide/"
    //         })
    //     }

    //     loadPyodide()
    // }, [])

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
        {/* <Row>
            <Column>
                <h1>Python Code Test</h1>
                <Button onClick={() => handlePython()}>Run Program</Button>
            </Column>
        </Row> */}
    </Grid>
}

export default ComputationPage