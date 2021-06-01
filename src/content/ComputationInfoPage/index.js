import { React, useState, useEffect } from 'react';
import { AspectRatio, Breadcrumb, BreadcrumbItem, Grid, Row, Column, Tabs, Tab, Button } from 'carbon-components-react';
import { Link, useParams } from 'react-router-dom';

import ModalStateManager from '../../components/ModalStateManager'
import ExportCellModal from '../../components/ExportCellModal'

import { Loading, Tile } from 'carbon-components-react';
import { Download16, Edit16, TrashCan16 } from '@carbon/icons-react';
import DeleteCellModal from '../../components/DeleteCellModal';
import FieldItemView from '../../components/FieldItemView';

import API from '../../components/API'


const ComputationInfoPage = () => {

    const { computationName } = useParams()

    const [computation, setComputation] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {

        API.getComputation(setComputation, { computationName: computationName }, setLoading)

    }, [computationName])

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
    </Grid>
}

export default ComputationInfoPage