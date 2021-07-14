import { Row, Column, Button, TextInput, Dropdown, Tile, Checkbox } from 'carbon-components-react';
import { DragVertical24, TrashCan16 } from '@carbon/icons-react';

import { useForceUpdate, slugify } from '../../components/Hooks.tsx'

const TAG_COLORS = [
    {
        text: 'Red',
        value: 'red'
    },
    {
        text: 'Magenta',
        value: 'magenta'
    },
    {
        text: 'Purple',
        value: 'purple'
    },
    {
        text: 'Blue',
        value: 'blue'
    },
    {
        text: 'Cyan',
        value: 'cyan'
    },
    {
        text: 'Teal',
        value: 'teal'
    },
    {
        text: 'Green',
        value: 'green'
    },
    {
        text: 'Gray',
        value: 'gray'
    },
    {
        text: 'Cool Gray',
        value: 'cool-gray'
    },
    {
        text: 'Warm Gray',
        value: 'warm-gray'
    },
    {
        text: 'High Contrast',
        value: 'high-contrast'
    },
]

const PRIMARY_DATA_TYPES = [
    {
        text: 'Integer Number',
        value: 'int'
    },
    {
        text: 'Text',
        value: 'string'
    },
]
const DATA_TYPES = [
    {
        text: 'Integer Number',
        value: 'int'
    },
    {
        text: 'Text',
        value: 'string'
    },
    {
        text: 'Decimal Number',
        value: 'float'
    },
    {
        text: 'Multi-select',
        value: 'multiselect',
        options: {
            multiselectStoredAs: "int",
            multiselectTags: false,
            multiselectOptions: []
        }
    },
]

const LibraryField = ({ library, forcePageUpdate, setLibrary, editable, i, provided }) => {

    const forceFieldUpdate = useForceUpdate()

    return <Tile className='create-library-page__field' style={editable && provided.draggableProps.style}><Row className='create-library-page__field-row'>
        <Column>
            <TextInput id={i.toString() + '-input'} value={library.fields[i].friendlyName} labelText={'Field name'} onChange={(e) => {
                library.fields[i].friendlyName = e.target.value
                library.fields[i].name = slugify(e.target.value)
                setLibrary(setLibrary)
                forceFieldUpdate()
            }} />
        </Column>
        <Column>
            <Dropdown id={i.toString() + '-typeSelector'} titleText='Field type' onChange={(e) => {
                library.fields[i].dataType = e.selectedItem
                setLibrary(setLibrary)
                forceFieldUpdate()
            }}

                selectedItem={library.fields[i].dataType}
                items={editable ? DATA_TYPES : PRIMARY_DATA_TYPES}

                itemToString={(dropdownItem) => (dropdownItem ? dropdownItem.text : '')}
            />
        </Column>
        {editable &&
            <Column max={2} className='create-library-page__field-actions'>

                <div {...provided.dragHandleProps}
                    className='create-library-page__drag-handle'
                >
                    <DragVertical24 />
                </div>


                <Button
                    hasIconOnly
                    renderIcon={TrashCan16}
                    tooltipAlignment="center"
                    tooltipPosition="bottom"
                    iconDescription="Delete field"
                    kind='danger' size='field'
                    onClick={() => {
                        library.fields.splice(i, 1)
                        setLibrary(setLibrary)
                        forcePageUpdate()
                    }}
                />

            </Column>
        }
    </Row>

        {(library.fields[i].dataType && library.fields[i].dataType.value === 'multiselect') && <> <Row>
            <Column>

                <h4>Multi-select options</h4>
                <Checkbox key={i + '-multiselect'} id={i + '-multiselect'} labelText={'Store as tags'} onChange={(value) => {
                    library.fields[i].dataType.options.multiselectTags = value
                    setLibrary(library)
                    forceFieldUpdate()
                }
                } checked={library.fields[i].dataType.options.multiselectTags} />

                <Button onClick={() => {
                    library.fields[i].dataType.options.multiselectOptions.push({
                        friendlyName: '',
                        storedAs: '',
                        color: null
                    })
                    forceFieldUpdate()
                }}>Add option</Button>

            </Column>
        </Row>

            {library.fields[i].dataType.options.multiselectOptions.map((item, j) => <>
                <Row>
                    <Column>
                        <TextInput key={i + '-' + j} id={i + '-' + j} value={item.friendlyName} labelText='Option name' onChange={e => {
                            item.friendlyName = e.target.value
                            setLibrary(library)
                            forceFieldUpdate()
                        }} />

                    </Column>
                    <Column>
                        <TextInput key={i + '-' + j + '-store'} id={i + '-' + j + '-store'} labelText='Option stored as' value={item.storedAs} onChange={e => {
                            item.storedAs = e.target.value
                            setLibrary(library)
                            forceFieldUpdate()
                        }} />

                    </Column>

                    {library.fields[i].dataType.options.multiselectTags && <Column>
                        <Dropdown id={i.toString() + '-typeSelector'} titleText='Tag color' onChange={(e) => {
                            item.color = e.selectedItem
                            setLibrary(setLibrary)
                            forceFieldUpdate()
                        }}

                            selectedItem={item.color}
                            items={TAG_COLORS}

                            itemToString={(dropdownItem) => (dropdownItem ? dropdownItem.text : '')}
                        />

                    </Column>}

                    <Column>
                        <Button
                            hasIconOnly
                            renderIcon={TrashCan16}
                            tooltipAlignment="center"
                            tooltipPosition="bottom"
                            iconDescription="Delete option"
                            kind='danger' size='field'
                            onClick={() => {
                                library.fields[i].dataType.options.multiselectOptions.splice(j, 1)
                                setLibrary(setLibrary)
                                forcePageUpdate()
                            }}
                        />
                    </Column>

                </Row>

            </>)}
        </>}

    </Tile>


}


export default LibraryField