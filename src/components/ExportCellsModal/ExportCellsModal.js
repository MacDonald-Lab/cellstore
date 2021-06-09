import { ComposedModal, ModalFooter, ModalHeader, ModalBody } from 'carbon-components-react';

import ColumnSelection from '../ColumnSelection';
import { useAPI, getDateString, saveAsCSV } from '../../components/Hooks'

import { useState } from 'react'

const ExportCellsModal = ({ open, setOpen, id, library}) => {
    
    const [callExport, {loading: loadingExportQuery}] = useAPI({url: 'exportCells'})
    const [columns, setColumns] = useState([])

    const ids = id.map(item => item.id)

    return <ComposedModal open={open} onClose={() => setOpen(false)}>
        <ModalHeader label={library.friendlyName} title='Export cells to .csv' />
        <ModalBody>
            <p>You will be exporting the following:</p>
            {id.length <= 5 ?
                id.map((item) => <strong key={item.id}>{item.id}</strong>) : <p>{id.length} cell(s)</p>
            }
            <ColumnSelection library={library} columns={columns} setColumns={setColumns}/>
        </ModalBody>
        <ModalFooter primaryButtonText="Download" primaryButtonDisabled={loadingExportQuery} secondaryButtonText="Cancel" onRequestSubmit={ async () => {
            const data = await callExport({ libraryName: library.name, cellIds: ids, columns})
            console.log(data)
            saveAsCSV(data, `${library.name}_${getDateString()}.csv`)
        }} />
    </ComposedModal>
}

export default ExportCellsModal