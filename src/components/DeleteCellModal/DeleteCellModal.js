import { ComposedModal, ModalFooter, ModalHeader, ModalBody } from 'carbon-components-react';
import { React } from 'react';

import { useMutation, gql } from '@apollo/client';
import {useHistory} from 'react-router-dom'
// Sample Props?
// - id and library
// - JSON object

// TODO add options for columns
// TOOD add cache updates

    const DELETION_MUTATION = gql`
        mutation DELETION_MUTATION($id: String!) {
            deleteRawDnaByJoanCellId(input: {joanCellId: $id}){
                deletedRawDnaId
            }
        }`;

const DeleteCellModal = ({ open, setOpen, id, redirect }) => {

    const [deleteCell, { errorMutation }] = useMutation(DELETION_MUTATION)
    const history = useHistory()

    return <ComposedModal open={open} onClose={() => setOpen(false)}>
        <ModalHeader label={'[current library name]'} title='Delete cell' />
        <ModalBody>
            <p>You will be deleting the following cell: <strong>{id}</strong></p>
        </ModalBody>
        <ModalFooter primaryButtonText="Delete" secondaryButtonText="Cancel" danger onRequestSubmit={() => {
            deleteCell({variables: {id: id}})
            if (errorMutation) alert(errorMutation)  
            else alert(`cell ${id} was deleted successfully`)
            setOpen(false)
            if (redirect) history.push('/library') 
        }
        } />
    </ComposedModal>
}

export default DeleteCellModal