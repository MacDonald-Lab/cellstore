import { React, useState, useEffect } from 'react';
import { Breadcrumb, BreadcrumbItem, Grid, Row, Column, ProgressIndicator, ProgressStep, Button, TextInput, Dropdown, SelectableTile, AspectRatio, ButtonSet, Tile, Checkbox } from 'carbon-components-react';
import { Link, useHistory } from 'react-router-dom'
import { Add16, ArrowDown16, ArrowUp16, TrashCan16 } from '@carbon/icons-react';
import ImportColumnNamesModal from '../../components/ImportColumnNamesModal';
import ModalStateManager from '../../components/ModalStateManager';
import DataTypes from '../../dataTypes'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

function slugify(string) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

function useForceUpdate() {
  // eslint-disable-next-line
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

const FormProgress = (props) => (
  <ProgressIndicator className="create-library-page__progress" currentIndex={props.step}>
    <ProgressStep label="Descriptors" />
    <ProgressStep label="Data types" />
    <ProgressStep label="Columns" />
    <ProgressStep label="Submit" />
  </ProgressIndicator>

)

const typeDescriptions = DataTypes.initDescriptions()

const CreateLibraryPage = () => {

  // states
  // FIXME potential for issue with primary key in general fields, move out to own

  const [library, setLibrary] = useState({
    name: "",
    friendlyName: "",
    description: "",
    fields: [
      {
        name: "",
        friendlyName: "",
        dataType: null,
        restrictions: null,
        primaryKey: true
      }
    ],
    dataTypes: [],
    viewingTableColumns: [],
  })

  const [page, setPage] = useState(0)

  const history = useHistory()

  const handleSubmit = async () => {

    // cleanup library submit
    for (var field of library.fields) {
      if (field.dataType.value === 'multiselect') {

        for (const option of field.dataType.options.multiselectOptions) {
          if (field.dataType.options.multiselectTags) {
            option.color = option.color.value
          }
          option.storedAs = parseInt(option.storedAs)
        }

        const tempData = field.dataType.options
        console.log(tempData)
        field.dataType = 'multiselect'

        Object.assign(field, tempData)
      }

      else {
        field.dataType = field.dataType.value
      }
    }

    for (const i of library.viewingTableColumns.keys()) {
      library.viewingTableColumns[i] = library.viewingTableColumns[i].name
    }

    await fetch('http://localhost:5001/createLibrary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(library)
    })

    history.push('/')

  }

  const Page1 = () => {

    const forcePageUpdate = useForceUpdate()

    const handleTextField = (e) => {
      const id = e.target.id
      var value = e.target.value

      library[id] = value
      if (id === 'friendlyName') library.name = slugify(value)

      setLibrary(library)
      forcePageUpdate()
    }

    const Field = ({ editable, i }) => {

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
          text: 'Integer',
          value: 'int'
        },
        {
          text: 'Text',
          value: 'string'
        },
      ]
      const DATA_TYPES = [
        {
          text: 'Integer',
          value: 'int'
        },
        {
          text: 'Text',
          value: 'string'
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

      const forceFieldUpdate = useForceUpdate()

      return <><Row className='create-library-page__field-row'>
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
        <Column>
        </Column>
        {editable &&
          <Column className='create-library-page__field-actions'>
            <Button
              hasIconOnly
              disabled={i === 1}
              renderIcon={ArrowUp16}
              tooltipAlignment="center"
              tooltipPosition="bottom"
              iconDescription="Move up"
              kind='ghost' size='field'
              onClick={() => {
                const temp = library.fields[i]
                library.fields[i] = library.fields[i - 1]
                library.fields[i - 1] = temp

                setLibrary(setLibrary)
                forcePageUpdate()
              }}
            />
            <Button
              hasIconOnly
              disabled={i === library.fields.length - 1}
              renderIcon={ArrowDown16}
              tooltipAlignment="center"
              tooltipPosition="bottom"
              iconDescription="Move down"

              kind='ghost' size='field'

              onClick={() => {
                const temp = library.fields[i]
                library.fields[i] = library.fields[i + 1]
                library.fields[i + 1] = temp

                setLibrary(setLibrary)
                forcePageUpdate()
              }}
            />


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

      </>


    }

    return <>
      <Row>
        <Column>
          <h3>General</h3>
          <p>A library is a collection of similar cells with the same identifiers, similar to a spreadsheet with column names. General information is used to identify library content.</p>
          <br />
        </Column>
      </Row>

      <Row>
        <Column lg={8}>
          <TextInput id={'friendlyName'} labelText={'Library name'} inline value={library.friendlyName} onChange={handleTextField} />
        </Column>
        <Column lg={8}>
          <TextInput id={'description'} labelText={'Library description'} inline value={library.description} onChange={handleTextField} />
        </Column>
      </Row>

      <Row>
        <Column>
          <br />
          <h3>Primary field</h3>
          <p>The primary field is the main identifier for items in this library.</p>
          <br />
        </Column>
      </Row>

      <Row>
        <Column>
          <br />
          <h3>Fields</h3>
          <br />
        </Column>
      </Row>

      {library.fields.map((item, i) => <Field editable={i !== 0} library={library} setLibrary={setLibrary} i={i} />)}

      <Row>
        <Column>
          <Button renderIcon={Add16} onClick={() => {
            library.fields.push({
              name: "",
              friendlyName: "",
              dataType: null,
              restrictions: null,
              primaryKey: false
            })

            setLibrary(library)
            forcePageUpdate()
          }}>Add field</Button>
          {/* <ModalStateManager renderLauncher={({ setOpen }) =>
          <Button onClick={() => setOpen(true)} renderIcon={Download16}>Import fields from file</Button>
        }>
          {(modalProps) => <ImportColumnNamesModal {...modalProps} fieldState={fields} fieldSetState={setFields} />}
        </ModalStateManager> */}
        </Column>
      </Row>

      <Row>
        <Column>
          <br />
          <ButtonSet>
            <Button onClick={() => setPage(1)}>Continue to data types</Button>
          </ButtonSet>
        </Column>
      </Row>
    </>
  }

  const Page2 = () => <>
    <Row>
      <Column>
        <h3>Data types</h3>
        <br />
      </Column>
    </Row>

    <Row condensed>
      {typeDescriptions.map(item => <Column sm={2} md={4} lg={4}>
        <SelectableTile id={item.id} name="tiles" key={item.id}>
          <AspectRatio ratio='2x1'>
            <p><strong>{item.name}</strong></p>
            <p>{item.description}</p>
            <div className={'create-library-page__data-icon'}>
              <item.icon />
            </div>
          </AspectRatio>
        </SelectableTile>
      </Column>

      )}
    </Row>

    <Row>
      <Column>
        <br />
        <ButtonSet>
          <Button kind='secondary' onClick={() => setPage(0)}>Return to descriptors</Button>
          <Button onClick={() => setPage(2)}>Continue to table columns</Button>
        </ButtonSet>
      </Column>
    </Row>

  </>

  const Page3 = () => {

    const forcePageUpdate = useForceUpdate()

    const [libraryColumns, setLibraryColumns] = useState(
      library.fields.slice(1)
    )

    const getItemStyle = (isDragging, draggableStyle) => ({
      // some basic styles to make the items look a bit nicer
      userSelect: "none",
      padding: 5 * 2,
      margin: `0 0 ${5}px 0`,

      // change background colour if dragging
      background: isDragging ? "lightgreen" : "grey",

      // styles we need to apply on draggables
      ...draggableStyle
    });

    const getListStyle = isDraggingOver => ({
      background: isDraggingOver ? "lightblue" : "lightgrey",
      padding: 5,
      width: 250
    });

    // a little function to help us with reordering the result
    const reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      return result;
    };

    const handleDragEnd = ({ source, destination }) => {
      const newReordered = reorder(libraryColumns, source.index, destination.index)
      setLibraryColumns(newReordered)
      library.viewingTableColumns = [
        library.fields[0],
        ...newReordered
      ]
      setLibrary(library)
      // forcePageUpdate()
    }

    return <>

      <Row>
        <Column>
          <DragDropContext onDragEnd={handleDragEnd}>

            <Droppable droppableId="droppable">
              {(provided, snapshot) =>
                <div {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}>

                  {libraryColumns.map((item, i) =>
                    <Draggable
                      key={item.name} draggableId={item.name} index={i}
                    >
                      {(provided, snapshot) =>
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <Tile>
                            <h5>{item.friendlyName}</h5>
                            <p>{item.name}</p>
                            <p>{item.dataType.text}</p>
                          </Tile>
                        </div>
                      }

                    </Draggable>


                  )}

                  {provided.placeholder}
                </div>
              }

            </Droppable>

          </DragDropContext>
        </Column>
      </Row>
      <Row>
        <Column>
          <br />
          <ButtonSet>
            <Button kind='secondary' onClick={() => setPage(1)}>Return to data types</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </ButtonSet>
        </Column>
      </Row >
    </>
  }

  // page renderer
  const PageRenderer = () => {
    if (page === 0) return <Page1 />
    if (page === 1) return <Page2 />
    if (page === 2) return <Page3 />
    return <p>Error</p>
  }

  return <Grid>
    <Row className="create-library-page__banner">
      <Column>

        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/settings">Settings</Link>
          </BreadcrumbItem>
        </Breadcrumb>

        <h1>Create a library</h1>
        <FormProgress step={page} />

      </Column>
    </Row>

    <PageRenderer />

  </Grid>
}

export default CreateLibraryPage;