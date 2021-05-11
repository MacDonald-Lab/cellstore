import { ComposedModal, ModalFooter, ModalHeader, ModalBody } from 'carbon-components-react';
import { React } from 'react';

import { useQuery, gql } from '@apollo/client';
import Papa from 'papaparse'

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

const handleExport = (id, { error, data }) => {
    // if (error || data.rawDnaByJoanCellId === null) alert('There was an error retrieving cell: ' + id)
    // else {
    //     console.log(data)
    //     const csv = Papa.unparse([data.rawDnaByJoanCellId])

    //     const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    //     var csvURL = null;
    //     if (navigator.msSaveBlob) {
    //         csvURL = navigator.msSaveBlob(csvData, 'download.csv');
    //     }
    //     else {
    //         csvURL = window.URL.createObjectURL(csvData);
    //     }

    //     const tempLink = document.createElement('a');
    //     tempLink.href = csvURL;
    //     tempLink.setAttribute('download', `humanCell_${id}.csv`);
    //     tempLink.click();
    // }
}

const ExportCellsModal = (props) => {

    const { open, setOpen, id } = props
    // console.log(id)

    // const MULTI_QUERY = () => {

    //     if (id !== null) {
    //         var strings = ''
    //         id.map((item) => strings = strings + `
    //                 rawDnaByJoanCellId(joanCellId: ` + item.id + `){
    //                     joanCellId
    //                     donorId
    //                     yearsWithT2D
    //                     age
    //                     sex
    //                     diabetesStatus
    //                 }
    //             `)

    //         return gql(`
    //             query LIBRARY_QUERY {
    //                 ` + strings + `
    //             }`)
    //     } else return gql`
    //         query MULTI_QUERY {

    //         }

    //         `
    // }



    const query = useQuery(LIBRARY_QUERY)

    // TODO: Display number only if there are too many items

    return <ComposedModal open={open} onClose={() => setOpen(false)}>
        <ModalHeader label={'[current library name]'} title='Export cells to CSV file' />
        <ModalBody>
            <p>You will be exporting the following cells:</p>
            {id.map((item) => <p><strong>{item.id}</strong></p>)}
        </ModalBody>
        <ModalFooter primaryButtonText="Download" secondaryButtonText="Cancel" onRequestSubmit={() => {
            handleExport(id, query)
            setOpen(false)
        }
        } />
    </ComposedModal>
}

export default ExportCellsModal