import { ComposedModal, ModalFooter, ModalHeader, ModalBody } from 'carbon-components-react';
import { React } from 'react';

import { useQuery, gql } from '@apollo/client';
import Papa from 'papaparse'
import ColumnSelection from '../ColumnSelection';

// Sample Props?
// - id and library
// - JSON object

// TODO add options for columns

    const LIBRARY_QUERY = gql`
        query LIBRARY_QUERY($id: String!) {
            rawDnaByJoanCellId(joanCellId: $id){
                joanCellId
                donorId
                yearsWithT2D
                age
                sex
                diabetesStatus
            }
        }`;

const handleExport = (id,  { error, data }) => {
    if (error || data.rawDnaByJoanCellId === null) alert('There was an error retrieving cell: ' + id)
    else {
        const csv = Papa.unparse([data.rawDnaByJoanCellId])

        const csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        var csvURL =  null;
        if (navigator.msSaveBlob)
        {
            csvURL = navigator.msSaveBlob(csvData, 'download.csv');
        }
        else
        {
            csvURL = window.URL.createObjectURL(csvData);
        }
    
        const tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', `humanCell_${id}.csv`);
        tempLink.click();
    }    
}

const ExportCellModal = (props) => {

    const { open, setOpen, id } = props
    const query = useQuery(LIBRARY_QUERY, {
        variables: { id: id }
    })

    return <ComposedModal open={open} onClose={() => setOpen(false)}>
        <ModalHeader label={'[current library name]'} title='Export cell to .csv' />
        <ModalBody>
            <p>You will be exporting the following cell: <strong>{id}</strong></p>
            <ColumnSelection />
        </ModalBody>
        <ModalFooter primaryButtonText="Download" secondaryButtonText="Cancel" onRequestSubmit={() => {
            handleExport(id, query)
            setOpen(false)
        }
        } />
    </ComposedModal>
}

export default ExportCellModal