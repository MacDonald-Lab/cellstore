import { useState } from 'react'
import { ComposedModal, ModalFooter, ModalHeader, ModalBody, Dropdown } from 'carbon-components-react'

import { useFetch, useAPI } from '../../components/Hooks.tsx'

const RunComputationModal = ({ open, setOpen, library }) => {

    const [computation, setComputation] = useState(null)
    const [computationMaps, setComputationMaps] = useState(undefined)
    const [submit, setSubmit] = useState(true)

    const { loading, data } = useFetch([{ url: 'getComputations' }])
    const [runComp] = useAPI({ url: 'runComputationOnLibrary' })

    const computations = data.getComputations

    if (loading) return <p>Loading...</p>
    if (!computations) return <p>Error</p>

    const handleSubmit = async () => {
        const response = await runComp({
            libraryName: library.name,
            computationName: computation.name,
            computationMaps
        })

        console.log(response)
    }

    const checkSubmit = () => {

        if (computationMaps) {

            const list = Object.keys(computationMaps).map(key => (!computationMaps[key]))
            console.log(!computation || list.indexOf(true) !== -1)
            setSubmit(!computation || list.indexOf(true) !== -1)
        } else setSubmit(true)

    }

    return <ComposedModal open={open} onClose={() => setOpen(false)}>
        <ModalHeader label={library.friendlyName} title='Run computation on library' />
        <ModalBody>
            <Dropdown id={'computation-dropdown'} titleText={'Computation name'} label='Select an option' items={computations} itemToString={item => item.friendlyName} onChange={({ selectedItem }) => {
                setComputation(selectedItem)

                var maps = {}
                for (const item of selectedItem.inputs) {
                    maps[item.parameterName] = undefined
                }
                setComputationMaps(maps)
                checkSubmit()

            }} />
            {computation && <>
                <h3>{computation.friendlyName}</h3>

                <h5>Fields</h5>


                {computation.inputs.map((item, i) => <Dropdown id={i} titleText={item.friendlyName} label='Select column' items={library.fields} itemToString={item => item.friendlyName} onChange={(select) => {
                    computationMaps[item.parameterName] = select.selectedItem.name
                    setComputationMaps(computationMaps)
                    checkSubmit()
                }} />)}

            </>}


        </ModalBody>
        <ModalFooter primaryButtonText="Run" secondaryButtonText="Cancel" onRequestSubmit={handleSubmit} primaryButtonDisabled={submit} />
    </ComposedModal>

}

export default RunComputationModal