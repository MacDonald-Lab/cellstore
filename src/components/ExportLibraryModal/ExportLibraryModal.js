import { ComposedModal, ModalFooter, ModalHeader, ModalBody } from 'carbon-components-react';
import ColumnSelection from '../ColumnSelection';
import { useAPI, saveAsCSV } from '../../components/Hooks'

import { useState } from 'react'

const ExportLibraryModal = ({ open, setOpen, library }) => {

   const [callExport, {loading: loadingExportQuery}] = useAPI({url: 'exportLibrary'})
    const [columns, setColumns] = useState([])


    return <ComposedModal open={open} onClose={() => setOpen(false)}>
        <ModalHeader label={library.friendlyName} title='Export library to .csv' />
        <ModalBody>
            <p>You will be exporting the whole library: <strong>{library.friendlyName}</strong></p>
            <ColumnSelection library={library} columns={columns} setColumns={setColumns} />
        </ModalBody>
        <ModalFooter primaryButtonText="Download" secondaryButtonText="Cancel" onRequestSubmit={async () => {
            const data = callExport({libraryName: library.name, columns})
            saveAsCSV(data, `${library.name}_all.csv`)
        }} primaryButtonDisabled={loadingExportQuery} />
    </ComposedModal>
}

export default ExportLibraryModal