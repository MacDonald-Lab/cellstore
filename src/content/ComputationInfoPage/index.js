import { React, useState, useEffect } from 'react';
import { AspectRatio, Breadcrumb, BreadcrumbItem, Grid, Row, Column, Tabs, Tab, Button, TextInput } from 'carbon-components-react';
import { Link, useParams } from 'react-router-dom';

import ModalStateManager from '../../components/ModalStateManager'
import ExportCellModal from '../../components/ExportCellModal'

import { useForceUpdate } from '../../components/Hooks'

import { Loading, Tile } from 'carbon-components-react';
import { Download16, Edit16, TrashCan16 } from '@carbon/icons-react';
import DeleteCellModal from '../../components/DeleteCellModal';
import FieldItemView from '../../components/FieldItemView';

import API from '../../components/API'


const ComputationInfoPage = () => {

    const { computationName } = useParams()

    const forcePageUpdate = useForceUpdate()

    const [computation, setComputation] = useState(null)
    const [loading, setLoading] = useState(true)
    const [computationValues, setComputationValues] = useState({})
    const [result, setResult] = useState(undefined)
    
    useEffect(() => {
        API.getComputation(setComputation, { computationName: computationName }, setLoading)
    }, [computationName])
    
    const handleChange = (e) => {
        const id = e.target.id
        var value = e.target.value
        
        computationValues[id] = value
        
        setComputationValues(computationValues)
        forcePageUpdate()
    }
    
    const handleSubmit = async () => {
        await API.runComputation(setResult, {
            computationName: computationName,
            computationParams: computationValues
        })
    }
    
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