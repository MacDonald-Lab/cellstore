import { useState } from 'react'
import { ComposedModal, ModalFooter, ModalHeader, ModalBody, TextInput } from 'carbon-components-react'
import { useHistory } from 'react-router-dom'

import API from '../API.tsx'

const DeleteLibraryModal = ({ open, setOpen, library }) => {
    const history = useHistory()

    const [submit, setSubmit] = useState(true)
    const [value, setValue] = useState('')

    const handleSubmit = async () => {
        await API.deleteLibrary(null, {libraryName: library.name})
        history.push('/')
    }

    return <ComposedModal open={open} onClose={() => {
        setOpen(false)
        setSubmit(true)
        setValue('')
    }}>
        <ModalHeader label={library.friendlyName} title='Delete library' />
        <ModalBody>
            <p>WARNING: This will delete the library along with all cell contents, history, and computation data. To ensure your data is safe, please export the library before proceeding.</p>
            <br />
            <strong><p>THIS ACTION IS IRREVERSABLE!</p></strong>
            <br />

            <TextInput placeholder={library.name} labelText={`To confirm, please type in: ${library.name}`} value={value} onChange={(e) => {
                setValue(e.target.value)
                if (e.target.value === library.name) setSubmit(false)
                else setSubmit(true)
            }} />


        </ModalBody>
        <ModalFooter primaryButtonText="Delete" secondaryButtonText="Cancel" onRequestSubmit={handleSubmit} primaryButtonDisabled={submit} danger />
    </ComposedModal>

}

export default DeleteLibraryModal

