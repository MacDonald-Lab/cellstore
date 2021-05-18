import { React, useState } from 'react';
import { Breadcrumb, BreadcrumbItem, Grid, Row, Column, ProgressIndicator, ProgressStep, Button, TextInput, Dropdown, SelectableTile, AspectRatio, ButtonSet } from 'carbon-components-react';
import { Link } from 'react-router-dom'
import { Add16, ArrowDown16, ArrowUp16, ChartArea32, ChartCustom32, DataConnected32, Download16, TrashCan16, WatsonHealthDna32 } from '@carbon/icons-react';
import ImportColumnNamesModal from '../../components/ImportColumnNamesModal';
import ModalStateManager from '../../components/ModalStateManager';

const FormProgress = (props) => (
  <ProgressIndicator className="create-library-page__progress" currentIndex={props.step}>
    <ProgressStep label="Descriptors" />
    <ProgressStep label="Data Types" />
    <ProgressStep label="Review" />
    <ProgressStep label="Submit" />
  </ProgressIndicator>

)

const cellDataTypes = [
  {
    name: "Genes",
    types: [
      {
        name: "Full Genome",
        description: "This is a description about full genome.",
        icon: WatsonHealthDna32
      },
      {
        name: "Gene Expression",
        description: "This is a description about gene expression.",
        icon: DataConnected32
      }
    ]
  },
  {
    name: "Electrophysiological Data",
    types: [
      {
        name: "HEKA Binary Data (raw)",
        description: "This is a description about HEKA binary data.",
        icon: ChartArea32
      },
      {
        name: "Calculated Results",
        description: "This is a description about calculated results.",
        icon: ChartCustom32
      }
    ]
  },
]

const CreateLibraryPage = (props) => {

  // states

  const [fields, setFields] = useState([])
  const [page, setPage] = useState(0)

  // pages

  const Page1 = () => <>
    <Row>
      <Column>
        <h3>General Information</h3>
        <br />
      </Column>
    </Row>

    <Row>
      <Column lg={8}>
        <TextInput id={'name'} labelText={'Library name'} inline />
      </Column>
      <Column lg={8}>
        <TextInput id={'name'} labelText={'Library description'} inline />
      </Column>
    </Row>
    <Row>
      <Column>
        <br />
        <h3>Fields</h3>
        <br />
      </Column>
    </Row>


    {fields.map((item, i) => (
      <Row className='create-library-page__field-row'>
        <Column>
          <TextInput id={i.toString() + '-input'} value={item[0]} labelText={'Field name'} onChange={(e) => {
            const tempFields = [...fields]
            tempFields[i][0] = e.target.value
            setFields(tempFields)
          }} />
        </Column>
        <Column>
          <Dropdown id={i.toString() + '-typeSelector'} titleText='Field type' onChange={(e) => {
            const tempFields = [...fields]
            tempFields[i][1] = e.selectedItem[1]
            setFields(tempFields)
          }}

            selectedItem={[item[1]]}
            items={dataTypes}

            itemToString={(dropdownItem) => (dropdownItem ? dropdownItem[0] : '')}
          />


        </Column>
        <Column className='create-library-page__field-actions'>
          <Button
            hasIconOnly
            disabled={i === 0}
            renderIcon={ArrowUp16}
            tooltipAlignment="center"
            tooltipPosition="bottom"
            iconDescription="Move up"
            kind='ghost' size='field'
            onClick={() => {
              const tempFields = [...fields]
              const temp = tempFields[i]
              tempFields[i] = tempFields[i - 1]
              tempFields[i - 1] = temp

              setFields(tempFields)
            }}
          />
          <Button
            hasIconOnly
            disabled={i === fields.length - 1}
            renderIcon={ArrowDown16}
            tooltipAlignment="center"
            tooltipPosition="bottom"
            iconDescription="Move down"

            kind='ghost' size='field'

            onClick={() => {
              const tempFields = [...fields]
              const temp = tempFields[i]
              tempFields[i] = tempFields[i + 1]
              tempFields[i + 1] = temp
              setFields(tempFields)
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
              const tempFields = [...fields]
              tempFields.splice(i, 1)
              setFields(tempFields)
            }}
          />

        </Column>
      </Row>

    ))}
    <Row>
      <Column>
        <Button renderIcon={Add16} onClick={handleAddField}>Add field</Button>
        <ModalStateManager renderLauncher={({ setOpen }) =>
          <Button onClick={() => setOpen(true)} renderIcon={Download16}>Import fields from file</Button>
        }>
          {(modalProps) => <ImportColumnNamesModal {...modalProps} fieldState={fields} fieldSetState={setFields}/>}
        </ModalStateManager>


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

  const Page2 = () => <>
    <Row>
      <Column>
        <h3>Data Types</h3>
        <br />
      </Column>
    </Row>

    {cellDataTypes.map((item, i) =>
      <>
        <Row>
          <Column>
            <br />
            <h4>{item.name}</h4>
            <br />
          </Column>
        </Row>
        <Row condensed>
          {item.types.map((type, j) =>
            <Column sm={2} md={4} lg={4}>

              <SelectableTile id={`${i}-${j}`} name="tiles" key={`${i}-${j}`}>
                <AspectRatio ratio='2x1'>
                  <p><strong>{type.name}</strong></p>
                  <p>{type.description}</p>
                  <div className={'create-library-page__data-icon'}>
                    <type.icon />
                  </div>
                </AspectRatio>
              </SelectableTile>
            </Column>

          )}
        </Row>
      </>


    )}
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

  const Page3 = () => <>

    <Row>
      <Column>
        <br />
        <ButtonSet>
          <Button kind='secondary' onClick={() => setPage(1)}>Return to data types</Button>
        </ButtonSet>
      </Column>
    </Row>

  </>

  // page renderer
  const PageRenderer = () => {
    if (page === 0) return <Page1 />
    if (page === 1) return <Page2 />
    if (page === 2) return <Page3 />
    return <p>Error</p>
  }


  // constants

  const dataTypes = [
    ['Integer', 'int'],
    ['Text', 'varchar'],
    ['Long text', 'varchar'],
    ['Multi-select', 'multi']
  ]

  // button handlers

  const handleAddField = () => {
    setFields([...fields, ['', 'none']])
  }

  return (
    <Grid>

      <Row className="create-library-page__banner">
        <Column>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/settings">Settings</Link>
            </BreadcrumbItem>

          </Breadcrumb>
          <h1>Create a Library</h1>

          <FormProgress step={page} />

        </Column>

      </Row>

      <PageRenderer />

    </Grid>

  )
}

export default CreateLibraryPage;