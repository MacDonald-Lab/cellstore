import { ComposedModal, ModalFooter, ModalHeader, ModalBody, FileUploaderDropContainer, FileUploaderItem, Checkbox, TextInput, ButtonSet, Button } from 'carbon-components-react';
import { React, useState } from 'react';
import { useForceUpdate } from '../../components/Hooks.tsx'

import papa from 'papaparse'
import { randId, slugify } from '../Hooks';

const getType = (str) => {

    // Infer type of string
    // Taken from https://stackoverflow.com/questions/16775547/javascript-guess-data-type-from-string

    if (typeof str !== 'string') str = str.toString();
    var nan = isNaN(Number(str));
    var isfloat = /^\d*(\.|,)\d*$/;
    var commaFloat = /^(\d{0,3}(,)?)+\.\d*$/;
    var dotFloat = /^(\d{0,3}(\.)?)+,\d*$/;
    var date = /^\d{0,4}(\.|\/)\d{0,4}(\.|\/)\d{0,4}$/;
    var email = /^[A-za-z0-9._-]*@[A-za-z0-9_-]*\.[A-Za-z0-9.]*$/;
    var phone = /^\+\d{2}\/\d{4}\/\d{6}$/g;
    if (!nan) {
        if (parseFloat(str) === parseInt(str)) return "integer";
        else return "float";
    }
    else if (isfloat.test(str) || commaFloat.test(str) || dotFloat.test(str)) return "float";
    else if (date.test(str)) return "date";
    else {
        if (email.test(str)) return "e-mail";
        else if (phone.test(str)) return "phone";
        else return "string";
    }
}

const determineType = (str) =>
{
    switch (str){
        case 'integer':
            return {
                value: 'int', text: "Integer Number"
            };
        case 'float':
            return {
                value: 'float', text: "Decimal Number"
            };
        default:
            return {value: 'string', text: "Text"}
    }

}

const ImportColumnNamesModal = (props) => {

    const forceUpdate = useForceUpdate()

    const [uploadedFile, setUploadedFile] = useState(null)
    const [fileHeaders, setFileHeaders] = useState(null)
    const [buttonDisabled, setButtonDisabled] = useState(true)

    const { open, setOpen, forcePageUpdate, library, setLibrary } = props

    const handleFileUpload = (evt, { addedFiles }) => {
        setUploadedFile(addedFiles[0])
        papa.parse(addedFiles[0], {
            header: true,
            worker: true, // Don't bog down the main thread if its a big file
            step: function (result, parser) {
                setFileHeaders(Object.keys(result.data).map(key => ({
                    name: key,
                    type: getType(result.data[key]),
                    selected: false,
                    friendlyName: undefined,
                    selectedAsColumn: false
                })))
                parser.abort()
            }
        })
    }

    const handleCheckbox = (value, id, event) => {

        var index = fileHeaders.findIndex(element => `field-check__${element.name}` === id)

        fileHeaders[index].selected = value
        setFileHeaders(fileHeaders)

        forceUpdate()
        setButtonDisabled(checkSubmit())
    }

    const handleItemDelete = () => {
        setUploadedFile(null)
        setFileHeaders(null)
        setButtonDisabled(true)
    }

    const handleFriendlyName = (e) => {
        const index = fileHeaders.findIndex(element => element.name === e.target.id)

        var value = undefined
        if (e.target.value !== "") value = e.target.value

        fileHeaders[index].friendlyName = value
        setFileHeaders(fileHeaders)
    }

    const checkSubmit = () => {
        if (!fileHeaders) return true
        if (fileHeaders.find(element => element.selected === true) === undefined) return true

        return false
    }

    const handleClose = () => {
        setOpen(false)
        handleItemDelete()
    }

    const handleSubmit = () => {
        
        library.fields = [...library.fields, ...fileHeaders.filter(element => element.selected === true).map(({friendlyName, type, name }) => ({
            friendlyName: name,
            type,
            dataType: determineType(type),
            name: slugify(name),
            key: randId(),
            primaryKey: false,
            restrictions: null
        }))]
        setLibrary(library)
        forcePageUpdate()
        setOpen(false)
    }

    const handleClearAll = () => {
        setFileHeaders(fileHeaders.map(item => ({
            ...item,
            selected: false
        })))

        setButtonDisabled(true)

    }

    const handleSelectAll = () => {
        setFileHeaders(fileHeaders.map(item => ({
            ...item,
            selected: true
        })))

        setButtonDisabled(false)

    }

    // TODO get rid of checkbox selection

    return <ComposedModal open={open} onClose={handleClose}>
        <ModalHeader label={'Create a library'} title='Import column names from .csv file' />
        <ModalBody>

            <p>Upload a file to automatically infer and import column names from a .csv file.</p>
            {
                fileHeaders === null ?
                    <FileUploaderDropContainer
                        labelText="Drag and drop file here or click to upload"
                        accept={['.csv']}
                        multiple={false}
                        name="Upload file"
                        onAddFiles={handleFileUpload}
                    /> : <>

                        <FileUploaderItem
                            name={uploadedFile.name} key={'u-file'} uuid={'u-file'} status={"edit"} onDelete={handleItemDelete} />

                        <ButtonSet>
                            <Button kind='secondary' onClick={handleClearAll}>Clear selected</Button>
                            <Button onClick={handleSelectAll}>Select all</Button>
                        </ButtonSet>

                        <fieldset>

                            {fileHeaders.map(field => <>

                                <Checkbox key={field.name} id={`field-check__${field.name}`} labelText={field.name} onChange={handleCheckbox} checked={field.selected} />
                                {field.selected &&

                                    <>
                                        <p><strong>Type: </strong>{field.type}</p>
                                        <TextInput onChange={handleFriendlyName} placeholder={`Set a friendly name for '${field.name}'`} id={field.name} value={field.friendlyName} />
                                    </>
                                }



                            </>
                            )}
                        </fieldset>
                    </>
            }


        </ModalBody>
        <ModalFooter primaryButtonText="Import" secondaryButtonText="Cancel" onRequestSubmit={handleSubmit} primaryButtonDisabled={buttonDisabled} />
    </ComposedModal>
}

export default ImportColumnNamesModal