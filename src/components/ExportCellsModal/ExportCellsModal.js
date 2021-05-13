import { ComposedModal, ModalFooter, ModalHeader, ModalBody } from 'carbon-components-react';
import { React } from 'react';

import { useLazyQuery, gql } from '@apollo/client';
import Papa from 'papaparse'

// Sample Props?
// - id and library
// - JSON object

// TODO add options for columns

const LIBRARY_QUERY = gql`
        query LIBRARY_QUERY($ids: [String!]) {
            allRawDnas(filter: {joanCellId: {in: $ids}}){
                nodes{
                joanCellId
                donorId
                yearsWithT2D
                age
                sex
                diabetesStatus
                }
            }
        }`;

const handleExport = (id, { loading, error, data }) => {
    if (!loading) {

        if (error || data.allRawDnas === null) alert('There was an error retrieving cell: ' + id)
        else {
            const csv = Papa.unparse(data.allRawDnas.nodes)

            const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            var csvURL = null;
            if (navigator.msSaveBlob) {
                csvURL = navigator.msSaveBlob(csvData, 'download.csv');
            }
            else {
                csvURL = window.URL.createObjectURL(csvData);
            }

            const tempLink = document.createElement('a');
            tempLink.href = csvURL;
            tempLink.setAttribute('download', `humanCell_export.csv`);
            tempLink.click();
        }
    }
}

const ExportCellsModal = (props) => {

    const { open, setOpen, id } = props

    const ids = id.map(item => item.id)
    const [getQuery, query] = useLazyQuery(LIBRARY_QUERY)

    // TODO: Display number only if there are too many items

    return <ComposedModal open={open} onClose={() => setOpen(false)}>
        <ModalHeader label={'[current library name]'} title='Export cells to CSV file' />
        <ModalBody>
            <p>You will be exporting the following cells:</p>
            {id.map((item) => <strong key={item.id}>{item.id}</strong>)}
        </ModalBody>
        <ModalFooter primaryButtonText="Download" secondaryButtonText="Cancel" onRequestSubmit={() => {
            getQuery({ variables: { ids: ids } })
            handleExport(id, query)
            setOpen(false)
        }
        } />
    </ComposedModal>
}

export default ExportCellsModal