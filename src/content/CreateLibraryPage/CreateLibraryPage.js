import { React, useState } from "react";
import {
  Grid,
  Row,
  Column,
  ProgressIndicator,
  ProgressStep,
  Button,
  TextInput,
  SelectableTile,
  AspectRatio,
  Tile,
  ButtonSet,
  Checkbox,
  DataTable,
  Table,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow
} from "carbon-components-react";
import { useHistory } from "react-router-dom";
import { Add16, Download16 } from "@carbon/icons-react";
import DataTypes from "../../dataTypes/index.ts";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Field from "../../components/LibraryField";
import { useForceUpdate, randId, slugify } from "../../components/Hooks.tsx";
import { useAPI } from "../../components/Hooks.tsx";
import PageHeader from "../../components/PageHeader";
import PageSection from "../../components/PageSection/PageSection";
import FormNavigation from "../../components/FormNavigation";
import ModalStateManager from "../../components/ModalStateManager";
import ImportColumnNamesModal from "../../components/ImportColumnNamesModal";

// HOOKS and FUNCTIONS

const FormProgress = (props) => (
  <ProgressIndicator
    className="create-library-page__progress"
    currentIndex={props.step}
  >
    <ProgressStep label="Descriptors" />
    <ProgressStep label="Data types" />
    <ProgressStep label="Columns" />
    <ProgressStep label="Submit" />
  </ProgressIndicator>
);

const ColumnTile = ({ friendlyName, name, dataType }) => (
  <Tile>
    <h5>{friendlyName}</h5>
    <p>{name}</p>
    <p>{dataType}</p>
  </Tile>
);

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  // userSelect: "none",
  // padding: 0,

  // change background colour if dragging
  // backgroundColor: isDragging && "gray",
  opacity: isDragging && 0.8,
  // position: 'static',
  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: 5,
  width: 250,
});

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const typeDescriptions = DataTypes.initDescriptions();

const CreateLibraryPage = () => {
  // states and hooks
  // FIXME potential for issue with primary key in general fields, move out to own

  const history = useHistory();
  const [callCreate] = useAPI({ url: "createLibrary" });
  const [page, setPage] = useState(0);
  const [library, setLibrary] = useState({
    name: "",
    friendlyName: "",
    description: "",
    fields: [
      {
        name: "",
        key: "primary-abcdef",
        friendlyName: "",
        dataType: null,
        restrictions: null,
        primaryKey: true,
      },
    ],
    dataTypes: [],
    viewingTableColumns: [],
  });

  const [formValid, setFormValid] = useState(false);
  const [valid, setValid] = useState({
    friendlyName: undefined,
    description: undefined,
  });

  const handleSubmit = async (libraryColumns) => {
      library.viewingTableColumns = [library.fields[0], ...libraryColumns.filter(item => item.selectedAsColumn)];
      setLibrary(library);

    // cleanup library submit
    for (var field of library.fields) {
      // if type is multiselect, add those values
      if (field.dataType.value === "multiselect") {
        for (const option of field.dataType.options.multiselectOptions) {
          // move color value up if tags is selected
          if (field.dataType.options.multiselectTags)
            option.color = option.color.value;

          // store multiselect values as int
          option.storedAs = parseInt(option.storedAs);
        }

        // elevate data out of field.dataType.options
        // so dataType can be just a string
        const tempData = field.dataType.options;
        field.dataType = "multiselect";
        Object.assign(field, tempData);
      }

      // if type is any other type, elevate value
      else {
        field.dataType = field.dataType.value;
      }
    }

    // elevate viewing column names
    for (const i of library.viewingTableColumns.keys()) {
      library.viewingTableColumns[i] = library.viewingTableColumns[i].name;
    }

    // call API to make library and redirect home
    await callCreate(library);
    history.push("/");
  };

  const Page1 = () => {
    const forcePageUpdate = useForceUpdate();

    const handleTextField = (e) => {
      const id = e.target.id;
      var value = e.target.value;

      library[id] = value;
      if (id === "friendlyName") library.name = slugify(value);

      setLibrary(library);
      forcePageUpdate();
    };

    const checkValid = (id, value) => {
      switch (id) {
        case "friendlyName":
          if (value === "") return "Text cannot be empty";
          if (!/[a-zA-Z]/.test(value.substring(0, 1)))
            return "Text must begin with a letter (a-z)";
          else return undefined;
        default:
          return undefined;
      }
    };

    const handleValid = (id, value) => {
      valid[id] = checkValid(id, value);
      setValid(valid);
    };

    const newHandleTextField = (e, id) => {
      library[id] = e.target.value;
      handleValid(id, e.target.value);
      setLibrary(library);
      setValid(valid);
      forcePageUpdate();
    };
    const setSlug = (e, id) => {
      library[id] = slugify(e.target.value);
      setLibrary(library);
    };

    const handleDragEnd = ({ source, destination }) => {
      if (destination) {
        library.fields = reorder(
          library.fields,
          source.index,
          destination.index
        );
        setLibrary(library);
      }
    };

    return (
      <>
        <PageSection
          title="General"
          description="A library is a collection of similar cells with the same
        identifiers, similar to a spreadsheet with column names. General
        information is used to identify library content."
        />

        <Row>
          <Column lg={8}>
            <TextInput
              id={"friendlyName"}
              helperText={"Required"}
              labelText={"Library name"}
              required
              inline
              invalidText={valid["friendlyName"]}
              invalid={valid["friendlyName"]}
              value={library.friendlyName}
              onChange={(e) => {
                setSlug(e, "name");
                newHandleTextField(e, "friendlyName");
              }}
            />
          </Column>
          <Column lg={8}>
            <TextInput
              id={"description"}
              labelText={"Library description"}
              inline
              value={library.description}
              onChange={handleTextField}
            />
          </Column>
        </Row>

        <PageSection
          title="Primary field"
          description="
              The primary field is the main identifier for items in this
              library."
        />

        <Field
          forcePageUpdate={forcePageUpdate}
          library={library}
          setLibrary={setLibrary}
          i={0}
        />

        <PageSection
          title="Fields"
          description="Fields contain information about the data in the library."
        />

        <Row>
          <Column>
            <ButtonSet>
              <Button
                renderIcon={Add16}
                onClick={() => {
                  const id = randId();

                  library.fields.push({
                    name: "",
                    key: id,
                    friendlyName: "",
                    dataType: null,
                    restrictions: null,
                    primaryKey: false,
                    selectedAsColumn: false,
                  });

                  setLibrary(library);
                  forcePageUpdate();
                }}
              >
                Add field
              </Button>
              <ModalStateManager
                renderLauncher={({ setOpen }) => (
                  <Button onClick={() => setOpen(true)} renderIcon={Download16}>
                    Import fields from file
                  </Button>
                )}
              >
                {(modalProps) => (
                  <ImportColumnNamesModal
                    {...modalProps}
                    library={library}
                    setLibrary={setLibrary}
                    forcePageUpdate={forcePageUpdate}
                  />
                )}
              </ModalStateManager>
              <Button renderIcon={Download16}>
                Import fields from Redcap definition
              </Button>
            </ButtonSet>
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
                  if (i > 0)
                    return (
                      <Draggable
                        key={item.key}
                        draggableId={item.key}
                        index={i}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            // {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <Field
                              editable={i !== 0}
                              library={library}
                              setLibrary={setLibrary}
                              i={i}
                              forcePageUpdate={forcePageUpdate}
                              provided={provided}
                            />
                          </div>
                        )}
                      </Draggable>
                    );

                  return null;
                })}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <FormNavigation
          next="Continue to data types"
          onNext={() => setPage(1)}
        />
      </>
    );
  };

  const Page2 = () => (
    <>
      <PageSection
        title="Data types"
        description="Data types are used to store more specific information about each cell."
      />

      <Row condensed>
        {typeDescriptions.map((item) => (
          <Column sm={2} md={4} lg={4}>
            <SelectableTile
              id={item.id}
              name="tiles"
              key={item.id}
              value={item.id}
              selected={library.dataTypes.includes(item.id)}
              onChange={() => {
                if (library.dataTypes.includes(item.id)) {
                  library.dataTypes = library.dataTypes.filter(
                    (filter) => filter !== item.id
                  );
                } else {
                  library.dataTypes = [...library.dataTypes, item.id];
                }
                setLibrary(library);
                console.log(library);
              }}
            >
              <AspectRatio ratio="2x1">
                <p>
                  <strong>{item.name}</strong>
                </p>
                <p>{item.description}</p>
                <div className={"create-library-page__data-icon"}>
                  <item.icon />
                </div>
              </AspectRatio>
            </SelectableTile>
          </Column>
        ))}
      </Row>

      <FormNavigation
        prev="Return to descriptors"
        next="Continue to tableColumns"
        onPrev={() => setPage(0)}
        onNext={() => setPage(2)}
      />
    </>
  );

  const Page3 = () => {
    const [libraryColumns, setLibraryColumns] = useState(
      library.fields.slice(1)
    );

    const forcePageUpdate = useForceUpdate()

    const handleDragEnd = ({ source, destination }) => {
      const newReordered = reorder(
        libraryColumns,
        source.index,
        destination.index
      );
      setLibraryColumns(newReordered);

    };

    return (
      <>
        <PageSection
          title="Table columns"
          description="Re-arrange how you would like your columns to appear in the table."
        />

        <Row>
          <Column>
          {libraryColumns.map((item, i) => (
            <Checkbox labelText={item.friendlyName} key={i} id={i} checked={item.selectedAsColumn} onChange={(value) => {
              item.selectedAsColumn = value;
              setLibraryColumns(libraryColumns);
              forcePageUpdate()
            }
            }/>))}
          </Column>
            <Column>
          <DragDropContext onDragEnd={handleDragEnd}>
              <ColumnTile
                name={library.fields[0].name}
                friendlyName={library.fields[0].friendlyName}
                dataType={library.fields[0].dataType.text}
              />
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {libraryColumns.map((item, i) => {if (item.selectedAsColumn) return (
                      <Draggable
                        key={item.name}
                        draggableId={item.name}
                        index={i}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <ColumnTile
                              name={item.name}
                              dataType={item.dataType.text}
                              friendlyName={item.friendlyName}
                            />
                          </div>
                        )}
                      </Draggable>
                    ) 
                    else return <div></div> })}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
          </DragDropContext>
            </Column>
        </Row>

        <PageSection
          title="Preview your colummns"
          description="Preview how your columns will appear in the table."
        />

        <DataTable rows={[]} headers={[{header: library.fields[0].friendlyName, key: library.fields[0].name}, ...libraryColumns.filter((item) => item.selectedAsColumn).map((item) => ({ header: item.friendlyName, key: item.name}))]}>

      {({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getSelectionProps,
        getBatchActionProps,
        onInputChange,
        selectedRows,
      }) => (
        <TableContainer>

          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            </Table>
            </TableContainer>)}



        </DataTable>

        <FormNavigation
          prev="Return to data types"
          next="Submit"
          onPrev={() => setPage(1)}
          onNext={() => handleSubmit(libraryColumns)}
        />
      </>
    );
  };

  // page renderer
  const PageRenderer = () => {
    if (page === 0) return <Page1 />;
    if (page === 1) return <Page2 />;
    if (page === 2) return <Page3 />;
    return <p>Error</p>;
  };

  return (
    <Grid>
      <PageHeader
        pageTitle="Create a library"
        breadcrumbs={[{ label: "Libraries", url: "/" }]}
      >
        <FormProgress step={page} />
      </PageHeader>

      <PageRenderer />
    </Grid>
  );
};

export default CreateLibraryPage;
