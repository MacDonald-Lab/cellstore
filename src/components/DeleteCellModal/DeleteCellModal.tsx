import { ComposedModal, ModalFooter, ModalHeader, ModalBody } from 'carbon-components-react';

import { useHistory } from 'react-router-dom'
import API from '../API'

const DeleteCellModal = ({ open, setOpen, library, id, redirect }: { open: boolean, setOpen: (value: boolean) => void, library: { [key: string]: any }, id: string, redirect: boolean }) => {

    const history = useHistory()

    return <ComposedModal open={open} onClose={() => setOpen(false)}>
        <ModalHeader label={library.friendlyName} title='Delete cell' />
        <ModalBody>
            <p>You will be deleting the following cell: <strong>{id}</strong></p>
        </ModalBody>
        <ModalFooter primaryButtonText="Delete" secondaryButtonText="Cancel" danger onRequestSubmit={async () => {

            await API.deleteCell(null, { libraryName: library.name, cellId: id })
            setOpen(false)
            if (redirect) history.push('/library/' + library.name)
        }
        } />
    </ComposedModal>
}

export default DeleteCellModal