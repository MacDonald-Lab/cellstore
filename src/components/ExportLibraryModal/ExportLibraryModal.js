import { ComposedModal, ModalFooter, ModalHeader, ModalBody } from 'carbon-components-react';
import { React } from 'react';

import { useLazyQuery, gql } from '@apollo/client';
import Papa from 'papaparse'

// Sample Props?
// - id and library
// - JSON object

// TODO add options for columns

const LIBRARY_QUERY = gql`
        query LIBRARY_QUERY {
            allRawDnas{
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

const handleExport = (data) => {
    if (data.allRawDnas === null) alert('There was an error retrieving library')
    else {
        console.log(data)
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

const ExportLibraryModal = (props) => {

    const { open, setOpen } = props

    const [getQuery, { loading }] = useLazyQuery(LIBRARY_QUERY, {
        onCompleted: (d) => {
            handleExport(d)
            setOpen(false)
        }
    })

    // TODO: Display number only if there are too many items

    return <ComposedModal open={open} onClose={() => setOpen(false)}>
        <ModalHeader label={'[current library name]'} title='Export cells to CSV file' />
        <ModalBody>
            <p>You will be exporting the whole library</p>
        </ModalBody>
        <ModalFooter primaryButtonText="Download" secondaryButtonText="Cancel" onRequestSubmit={() => getQuery()} primaryButtonDisabled={loading} />
    </ComposedModal>
}

export default ExportLibraryModal