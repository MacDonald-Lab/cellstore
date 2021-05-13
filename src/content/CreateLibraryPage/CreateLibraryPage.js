import { React, useState } from 'react';
import { Breadcrumb, BreadcrumbItem, Grid, Row, Column, ProgressIndicator, ProgressStep, Button, TextInput, Dropdown } from 'carbon-components-react';
import { Link } from 'react-router-dom'
import { Add16, ArrowDown16, ArrowUp16, TrashCan16 } from '@carbon/icons-react';

const FormProgress = (props) => (
  <ProgressIndicator className="create-library-page__progress" currentIndex={props.step}>
    <ProgressStep label="Descriptors" />
    <ProgressStep label="Data Types" />
    <ProgressStep label="Review" />
    <ProgressStep label="Submit" />
  </ProgressIndicator>

)

const CreateLibraryPage = (props) => {

  // states

  const [fields, setFields] = useState([])


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

          <FormProgress step={0} />

        </Column>

      </Row>


      <Row>
        <Column>
          <h3>Fields</h3>
        </Column>
      </Row>
      {fields.map((item, i) => (
        <Row>
          <Column>
            <TextInput id={i.toString() + '-input'} value={item[0]} labelText={'Field name'} onChange={(e) => {
              const tempFields = [...fields]
              tempFields[i][0] = e.target.value
              setFields(tempFields)
            }} />
          </Column>
          <Column>
            <Dropdown id={i.toString() + '-typeSelector'} label='Field type' onChange={(e) => {
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

        </Column>

      </Row>


      <Row>
        <Column>
          <h1>Label Data Columns</h1>
          <FormProgress step={1} />
        </Column>

      </Row>
      <Row>
        <Column>

          <h1>Review</h1>
          <FormProgress step={2} />
        </Column>

      </Row>




    </Grid>

  )
}

export default CreateLibraryPage;