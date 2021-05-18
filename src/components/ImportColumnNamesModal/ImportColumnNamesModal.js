import { ComposedModal, ModalFooter, ModalHeader, ModalBody, FileUploaderDropContainer, FileUploaderItem, Checkbox, TextInput } from 'carbon-components-react';
import { React, useState } from 'react';

import papa from 'papaparse'

function getType(str) {
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


const ImportColumnNamesModal = (props) => {

    const [uploadedFile, setUploadedFile] = useState(null)
    const [fileHeaders, setFileHeaders] = useState(null)
    const [buttonDisabled, setButtonDisabled] = useState(true)

    const { open, setOpen } = props

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
                    friendlyName: undefined
                })))
                 parser.abort()
            }
        })
    }

    const handleCheckbox = (value, id, event) => {
        const index = fileHeaders.findIndex(element => element.name === id)

        fileHeaders[index].selected = !fileHeaders[index].selected
        console.log(fileHeaders)
        setFileHeaders(fileHeaders)

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
        console.log(fileHeaders)
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

    return <ComposedModal open={open} onClose={handleClose}>
        <ModalHeader label={'[current library name]'} title='Import column names from .csv file' />
        <ModalBody>

            <p>Upload a file to automatically infer and import column names from a .csv file.</p>
            {
                fileHeaders === null ?
                    <FileUploaderDropContainer
                        labelText="Drag and drop file here or click to upload"
                        accept={['.csv']}
                        multiple={false}
                        name="Upload images"
                        onAddFiles={handleFileUpload}
                    /> : <>


                        <FileUploaderItem
                            name={uploadedFile.name} key={'u-file'} uuid={'u-file'} status={"edit"} onDelete={handleItemDelete} />
                        {fileHeaders.map(field => <>

                            <Checkbox key={field.name} id={field.name} labelText={field.name} onChange={handleCheckbox} />
                            <p><strong>Type: </strong>{field.type}</p>
                            <TextInput onChange={handleFriendlyName} placeholder='Set a friendly name' id={field.name} value={field.friendlyName} />

                        </>
                        )}
                    </>
            }


        </ModalBody>
        <ModalFooter primaryButtonText="Import" secondaryButtonText="Cancel" primaryButtonDisabled={buttonDisabled} />
    </ComposedModal>
}

export default ImportColumnNamesModal