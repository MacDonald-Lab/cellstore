import { ComposedModal, ModalFooter, ModalHeader, ModalBody } from 'carbon-components-react';
import { React } from 'react';
import { useAPI } from '../../components/Hooks'


const DeleteCellsModal = ({ open, setOpen, id, library }) => {

    const [callDelete, { loading: loadingDelete }] = useAPI({ url: 'deleteCells' })

    const ids = id.map(item => item.id)

    return <ComposedModal open={open} onClose={() => setOpen(false)}>
        <ModalHeader label={library.friendlyName} title='Delete cells' />
        <ModalBody>
            <p>You will be deleting the following:</p>

            {id.length <= 5 ?
                id.map((item) => <strong key={item.id}>{item.id}</strong>) : <p>{id.length} cell(s)</p>
            }
        </ModalBody>
        <ModalFooter primaryButtonText="Delete" danger primaryButtonDisabled={loadingDelete} secondaryButtonText="Cancel" onRequestSubmit={async () => {
            await callDelete({ libraryName: library.name, cellIds: ids })
            setOpen(false)
        }
        } />
    </ComposedModal>
}

export default DeleteCellsModal