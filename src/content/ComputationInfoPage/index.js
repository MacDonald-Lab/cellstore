import { React, useState } from 'react';
import { Grid, Row, Column, Button, TextInput, Loading } from 'carbon-components-react';
import { useParams } from 'react-router-dom';

import { useForceUpdate, useFetch, useAPI } from '../../components/Hooks.tsx'

const ComputationInfoPage = () => {

    const { computationName } = useParams()

    const forcePageUpdate = useForceUpdate()

    const [computationParams, setComputationParams] = useState({})
    const [result, setResult] = useState(undefined)
    const [runComp] = useAPI({ url: 'runComputation' })

    const { loading, data } = useFetch([{ url: 'getComputation', params: { computationName } }])

    const computation = data.getComputation


    const handleChange = (e) => {
        const id = e.target.id
        var value = e.target.value

        computationParams[id] = value

        setComputationParams(computationParams)
        forcePageUpdate()
    }

    const handleSubmit = async () => await runComp({ computationName, computationParams }, setResult)

    if (loading) return (<Loading />)
    if (!computation) return <p>Error</p>


    return <Grid>
        <Row>
            <Column>
                <h1>{computation.definition.friendlyName}</h1>
            </Column>
        </Row>
        <Row>
            <Column>
                <p>{computation.definition.name}</p>
                <p>{computation.definition.friendlyName}</p>
                <p>{computation.definition.description}</p>

            </Column>
        </Row>
        <Row>
            <Column>
                <h3>Inputs</h3>
            </Column>
        </Row>
        <Row>
            {computation.definition.inputs.map((item) => <Column max={4}>
                <p>{item.friendlyName}</p>
                <p>{item.description}</p>
                <p>Available data types: {item.dataTypes.map(item => item + ' ')}</p>
            </Column>)}
        </Row>
        <Row>
            <Column>
                <h3>Outputs</h3>
            </Column>
        </Row>
        <Row>
            {computation.definition.outputs.map((item) => <Column max={4}>
                <p>{item.friendlyName}</p>
                <p>{item.description}</p>
                <p>Data types: {item.dataType}</p>
            </Column>)}
        </Row>
        <Row>
            <Column>
                <h3>Run Sample Calculation</h3>
            </Column>
        </Row>
        <Row>
            {computation.definition.inputs.map((item, i) => <Column max={4}>

                <TextInput id={item.parameterName} labelText={item.friendlyName} placeholder={'Enter a value:'} onChange={handleChange} />
                <p>Available data types: {item.dataTypes.map(item => item + ' ')}</p>
                <p>{item.description}</p>
            </Column>)}
        </Row>

        <Row>
            <Column>
                <Button onClick={handleSubmit}>Run Calculation</Button>
            </Column>
        </Row>

        {result && <>
            <Row>
                <Column>
                    <h3>Results</h3>
                </Column>
            </Row>
            <Row>
                {computation.definition.outputs.map((item, i) =>
                    <Column max={4}>
                        <p>
                            {item.friendlyName}: {result[item.parameterName]}
                        </p>

                    </Column>

                )}
            </Row>
        </>
        }
    </Grid>
}

export default ComputationInfoPage