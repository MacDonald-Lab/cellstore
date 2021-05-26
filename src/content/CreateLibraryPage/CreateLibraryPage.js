import { React, useState, useEffect } from 'react';
import { Breadcrumb, BreadcrumbItem, Grid, Row, Column, ProgressIndicator, ProgressStep, Button, TextInput, Dropdown, SelectableTile, AspectRatio, ButtonSet } from 'carbon-components-react';
import { Link } from 'react-router-dom'
import { Add16, ArrowDown16, ArrowUp16, Download16, TrashCan16 } from '@carbon/icons-react';
import ImportColumnNamesModal from '../../components/ImportColumnNamesModal';
import ModalStateManager from '../../components/ModalStateManager';
import DataTypes from '../../dataTypes'

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

const Field = ({ library, setLibrary, primary, i }) => {

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
      value: 'multiselect'
    },
  ]

  const forceUpdate = useForceUpdate()

  return <Row className='create-library-page__field-row'>
    <Column>
      <TextInput id={i.toString() + '-input'} value={library.fields[i].friendlyName} labelText={'Field name'} onChange={(e) => {
        library.fields[i].friendlyName = e.target.value
        setLibrary(setLibrary)
        forceUpdate()
      }} />
    </Column>
    <Column>
      <Dropdown id={i.toString() + '-typeSelector'} titleText='Field type' onChange={(e) => {
        library.fields[i].dataType = e.selectedItem
        setLibrary(setLibrary)
        forceUpdate()
      }}

        selectedItem={library.fields[i].dataType}
        items={DATA_TYPES}

        itemToString={(dropdownItem) => (dropdownItem ? dropdownItem.text : '')}
      />
    </Column>

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
          forceUpdate()
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
          library.fields[i] = library.fields[i - 1]
          library.fields[i - 1] = temp

          setLibrary(setLibrary)
          forceUpdate()
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
          forceUpdate()
        }}
      />

    </Column>
  </Row>


}

const typeDescriptions = DataTypes.initDescriptions()

// const oldCellDataTypes = [
//   {
//     name: "Genes",
//     types: [
//       {
//         name: "Full Genome",
//         description: "This is a description about full genome.",
//         icon: WatsonHealthDna32
//       },
//       {
//         name: "Gene Expression",
//         description: "This is a description about gene expression.",
//         icon: DataConnected32
//       }
//     ]
//   },
//   {
//     name: "Electrophysiological Data",
//     types: [
//       {
//         name: "HEKA Binary Data (raw)",
//         description: "This is a description about HEKA binary data.",
//         icon: ChartArea32
//       },
//       {
//         name: "Calculated Results",
//         description: "This is a description about calculated results.",
//         icon: ChartCustom32
//       }
//     ]
//   },
// ]
// pages

const Page1 = ({ library, setLibrary, setPage }) => {

  const forceUpdate = useForceUpdate()

  const handleTextField = (e) => {
    const id = e.target.id
    var value = e.target.value
    
    const tempLibrary = {...library}
    tempLibrary[id] = value

    setLibrary(tempLibrary)
    // forceUpdate()
  }

  return <>
    <Row>
      <Column>
        <h3>General</h3>
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

    {library.fields.map((item, i) => { if (i !== 0) return <Field library={library} setLibrary={setLibrary} item={item} i={i} /> })}

    <Row>
      <Column>
        {/* <Button renderIcon={Add16} onClick={handleAddField}>Add field</Button> */}
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
const Page2 = ({ setPage }) => <>
  <Row>
    <Column>
      <h3>Data Types</h3>
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

        <Button onClick={() => setPage(2)}>Continue to Review</Button>
      </ButtonSet>
    </Column>
  </Row>

</>

const Page3 = ({setPage}) => <>
  < Row >
    <Column>
      <br />
      <ButtonSet>
        <Button kind='secondary' onClick={() => setPage(1)}>Return to data types</Button>
      </ButtonSet>
    </Column>
  </Row >
</>

const CreateLibraryPage = () => {

  const forceUpdate = useForceUpdate()

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
        dataType: {
          text: 'Integer',
          value: 'int'
        },
        restrictions: null,
        primaryKey: true
      }
    ],
    dataTypes: [],
    viewingTableColumns: [],

  })



  const [page, setPage] = useState(0)

  // page renderer
  const PageRenderer = () => {
    if (page === 0) return <Page1 library={library} setLibrary={setLibrary} setPage={setPage} />
    if (page === 1) return <Page2 setPage={setPage} />
    if (page === 2) return <Page3 setPage={setPage} />
    return <p>Error</p>
  }


  // button handlers


  return (
    <Grid>

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

  )
}

export default CreateLibraryPage;