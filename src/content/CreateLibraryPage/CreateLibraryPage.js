import { React, useState } from 'react';
import { Breadcrumb, BreadcrumbItem, Grid, Row, Column, ProgressIndicator, ProgressStep, Button, TextInput, SelectableTile, AspectRatio, ButtonSet, Tile } from 'carbon-components-react';
import { Link, useHistory } from 'react-router-dom'
import { Add16 } from '@carbon/icons-react';
import ImportColumnNamesModal from '../../components/ImportColumnNamesModal';
import ModalStateManager from '../../components/ModalStateManager';
import DataTypes from '../../dataTypes'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Field from '../../components/LibraryField'
import { useForceUpdate, randId, slugify } from '../../components/Hooks.tsx'
import API from '../../components/API'

// HOOKS and FUNCTIONS

const FormProgress = (props) => (
  <ProgressIndicator className="create-library-page__progress" currentIndex={props.step}>
    <ProgressStep label="Descriptors" />
    <ProgressStep label="Data types" />
    <ProgressStep label="Columns" />
    <ProgressStep label="Submit" />
  </ProgressIndicator>

)

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  // userSelect: "none",
  // padding: 0,

  // change background colour if dragging
  // backgroundColor: isDragging && "gray",
  opacity: isDragging && 0.8,
  // position: 'static',
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
        key: 'primary-abcdef',
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

    await API.createLibrary(library)

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

    const handleDragEnd = ({ source, destination }) => {
      if (destination) {


        library.fields = reorder(library.fields, source.index, destination.index)
        setLibrary(library)
      }
    }

    // const renderDraggable = useDraggableInPortal()

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
      <Field forcePageUpdate={forcePageUpdate} library={library} setLibrary={setLibrary} i={0} />

      <Row>
        <Column>
          <br />
          <h3>Fields</h3>
          <br />
        </Column>
      </Row>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="fields">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            // style={getListStyle(snapshot.isDraggingOver)}
            >

              {library.fields.map((item, i) => {
                if (i > 0) return <Draggable key={item.key} draggableId={item.key} index={i} >
                  {((provided, snapshot) =>
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      // {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}>


                      <Field editable={i !== 0} library={library} setLibrary={setLibrary} i={i} forcePageUpdate={forcePageUpdate} provided={provided} />

                    </div>)}


                </Draggable>
              }



              )}



            </div>



          )}


        </Droppable>





      </DragDropContext>

      <Row>
        <Column>
          <Button renderIcon={Add16} onClick={() => {

            const id = randId()

            library.fields.push({
              name: "",
              key: id,
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



    const handleDragEnd = ({ source, destination }) => {
      const newReordered = reorder(libraryColumns, source.index, destination.index)
      setLibraryColumns(newReordered)
      library.viewingTableColumns = [
        library.fields[0],
        ...newReordered
      ]
      setLibrary(library)
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