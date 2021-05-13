import { ComposedModal, ModalFooter, ModalHeader, ModalBody } from 'carbon-components-react';
import { React } from 'react';

import { gql, useMutation } from '@apollo/client';

// Sample Props?
// - id and library
// - JSON object

// TODO add options for columns

const DELETE_CELLS_MUTATION = gql`
    mutation DELETE_CELLS_MUTATION($mutationId: String!, $patch: [RawDnaPatch!]) {
        mnDeleteRawDnaByJoanCellId(input: {
            clientMutationId: $mutationId
            mnRawDnaPatch: $patch  
        }) {
            clientMutationId
        }
    }`;

const DeleteCellsModal = (props) => {

    const { open, setOpen, id } = props

    const ids = id.map(item => ({ joanCellId: item.id}))


    const [setMutation, {loading}] = useMutation(DELETE_CELLS_MUTATION, {
        onCompleted: () => setOpen(false),
        onError: (e) => alert(e.message)
    })

    // TODO: Display number only if there are too many items

    return <ComposedModal open={open} onClose={() => setOpen(false)}>
        <ModalHeader label={'[current library name]'} title='Delete cells' />
        <ModalBody>
            <p>You will be deleting the following cells:</p>
            {id.map((item) => <strong key={item.id}>{item.id}</strong>)}
        </ModalBody>
        <ModalFooter primaryButtonText="Delete" danger primaryButtonDisabled={loading} secondaryButtonText="Cancel" onRequestSubmit={() => {
            setMutation({ variables: { patch: ids, mutationId: 'test' } })
        }
        } />
    </ComposedModal>
}

export default DeleteCellsModal