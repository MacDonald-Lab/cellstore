import { ComposedModal, ModalFooter, ModalHeader, ModalBody } from 'carbon-components-react';

import ColumnSelection from '../ColumnSelection';
import { useAPI, getPkNameOfLibrary, saveAsCSV } from '../../components/Hooks'

import { useState } from 'react'

const ExportCellModal = ({ open, setOpen, id, library }) => {

    const [callExport, { loading: loadingExportQuery }] = useAPI({ url: 'exportCell' })
    const [columns, setColumns] = useState([])

    return <ComposedModal open={open} onClose={() => setOpen(false)}>
        <ModalHeader label={library.friendlyName} title='Export cell to .csv' />
        <ModalBody>
            <p>You will be exporting the following cell: <strong>{id}</strong></p>
            <ColumnSelection library={library} columns={columns} setColumns={setColumns} />
        </ModalBody>
        <ModalFooter primaryButtonDisabled={loadingExportQuery} primaryButtonText="Download" secondaryButtonText="Cancel" onRequestSubmit={async () => {
            const data = await callExport({ libraryName: library.name, cellId: id, columns })
            saveAsCSV([data], `${library.name}_${data[getPkNameOfLibrary(library)]}.csv`)
            setOpen(false)
        }} />
    </ComposedModal>
}

export default ExportCellModal