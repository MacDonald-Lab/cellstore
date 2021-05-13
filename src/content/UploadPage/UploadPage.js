import { React, useState } from 'react';
import { Breadcrumb, BreadcrumbItem, Grid, Row, Column, FileUploaderDropContainer, Form, FormGroup, Checkbox, ProgressIndicator, ProgressStep, Button, InlineLoading, FileUploaderItem, Tile, AspectRatio, SelectItem, Select } from 'carbon-components-react';
import { Link } from 'react-router-dom'
import papa from 'papaparse'
import { useMutation, gql } from '@apollo/client';

const ADD_CELL = gql`
  mutation AddCell(
      $joan_cell_id: String!,
      $diabetes_status: Int!,
      $years_with_t2d: Int,
      $age: Int!,
      $sex: Int!,
      $donor_id: String!,
    ) {
    createRawDna( input: {
      rawDna: { 
        joanCellId: $joan_cell_id,
        diabetesStatus: $diabetes_status,
        yearsWithT2D: $years_with_t2d,
        age: $age,
        sex: $sex,
        donorId: $donor_id
      }
    }
      ) {
      rawDna {
        joanCellId
      }
    }
  }
`;


const SelectLibrary = (props) => {
  const options = props.options
  const stateOptions = props.stateOptions
  const id = props.id

  const [currentValue, setCurrentValue] = useState('none')

  const handleUpdate = (e) => {


    console.log(e.target.value)
    if (currentValue !== 'none') {
      options[currentValue] = [options[currentValue][0], false]
      stateOptions(options)
    }

    if (e.target.value !== 'none') {
      options[e.target.value] = [options[e.target.value][0], true]
      stateOptions(options)
    }


    setCurrentValue(e.target.value)

  }

  return (
    <Select id={id} defaultValue="none" onChange={handleUpdate}>
      <SelectItem
        value="none"
        text="None"
      />
      {
        options.map((item, i) => (
          <SelectItem value={i} disabled={item[1]} text={item[0]} />
        ))
      }

    </Select>
  )
}

const FormProgress = (props) => (
  <ProgressIndicator className="upload-page__progress" currentIndex={props.step}>
    <ProgressStep label="Upload Files" />
    <ProgressStep label="Label Data" />
    <ProgressStep label="Review" />
    <ProgressStep label="Submit into Database" />
  </ProgressIndicator>

)

const UploadPage = (props) => {





  // State counter (pages)


  // States
  const [uploadedFile, setUploadedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fileHeaders, setFileHeaders] = useState([])
  const [libraryOptions, setLibraryOptions] = useState([
    ["Helo", false],
    ['hi', false],
    ['uo', false]
  ])

  // -- DB Mutation

  const [addCell, { errorMutation }] = useMutation(ADD_CELL, {
    update(cache, { data: { addCell } }) {
      cache.modify({
        fields: {
          todos(existingCells = []) {
            const newCellRef = cache.writeFragment({
              data: addCell,
              fragment: gql`
                fragment NewCell on Cell {
                  joanCellId
                  diabetesStatus
                  yearsWithT2D
                  age
                  sex
                  donorId
                }
              `
            });
            return [...existingCells, newCellRef];
          }
        }
      });
    }
  })



  // Upload Handlers
  const handleItemDelete = (evt, { uuid }) => {
    // code for multiple files
    // setUploadedFiles(uploadedFiles.filter((item, index) => index !== parseInt(uuid)))
    setUploadedFile(null)

  }

  const handleFileUpload = (evt, { addedFiles }) => {
    var count = 0; // cache the running count
    // console.log(addedFiles[0])
    setLoading(true)
    setUploadedFile(addedFiles[0])
    papa.parse(uploadedFile, {
      header: true,
      worker: true, // Don't bog down the main thread if its a big file
      step: function (result) {
        if (count === 0) {
          setFileHeaders(Object.keys(result.data))
        }
        console.log(result.data)
        count++;
      },
      complete: function (results, file) {
        console.log('parsing complete read', count, 'records.');
        setLoading(false)

      }
    })
  }

  const handleFileSubmit = () => {
    var count = 0; // cache the running count
    setLoading(true)
    papa.parse(uploadedFile, {
      header: true,
      worker: true, // Don't bog down the main thread if its a big file
      step: function (result) {
        // if (count === 10) {
          const editedResults = result.data
          editedResults.diabetes_status = parseInt(editedResults.diabetes_status)
          editedResults.years_with_t2d = parseInt(editedResults.years_with_t2d)
          editedResults.age = parseInt(editedResults.age)
          editedResults.sex = parseInt(editedResults.sex)
          // if (editedResults.years_with_t2d === null) {

          // }

          addCell({ variables: editedResults })
          // console.log({...result.data})
        // }
        count++;
      },
      complete: function (results, file) {
        console.log('add to db complete', count, 'records.');
        setLoading(false)

      }
    })
  }

  // Library Handlers

  return (<>

    <Grid>

      <Row className="upload-page__banner">
        <Column>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/library">Cell Library</Link>
            </BreadcrumbItem>

          </Breadcrumb>
          <h1>Upload to Cell Library</h1>

          <FormProgress step={0} />

        </Column>

      </Row>

      <Row>
        <Column>

          <Form>

            <FormGroup legendText="Select Data Types">
              <Checkbox labelText="Donor Information" />
              <Checkbox labelText="Electrophysiological Data" />
              <Checkbox labelText="Gene Expression" />

            </FormGroup>


            <FormGroup legendText="Upload .csv Donor Information">
              {
                uploadedFile === null ?
                  <FileUploaderDropContainer
                    labelText="Drag and drop file here or click to upload"
                    accept={['.csv']}
                    multiple={false}
                    name="Upload images"
                    onAddFiles={handleFileUpload}
                  /> : <FileUploaderItem
                    name={uploadedFile.name} key={'u-file'} uuid={'u-file'} status={"edit"} onDelete={handleItemDelete} />

              }

              {loading ? <><p>Processing</p> <InlineLoading /></> : <p>Not processing</p>}
              <p>{fileHeaders}</p>
            </FormGroup>

            <Button>Continue to Label Data</Button>
            <Button onClick={handleFileSubmit}>Test Upload</Button>

          </Form>
        </Column>
      </Row>
      <Row>
        <Column>
          {errorMutation}
          <h1>Label Data Columns</h1>
          <FormProgress step={1} />
        </Column>

      </Row>
      <Row>
        {fileHeaders.map((item, i) => (
          <Column sm={2} md={2} lg={2} className="upload-page__label">
            <Tile>
              <AspectRatio ratio="1x1">
                <p>{item}</p>
                <SelectLibrary id={i} options={libraryOptions} stateOptions={setLibraryOptions} />
              </AspectRatio>
            </Tile>
          </Column>
        ))}

      </Row>
      <Row>
        <Column>

          <h1>Review</h1>
          <FormProgress step={2} />
        </Column>

      </Row>




    </Grid>

  </>)
}

export default UploadPage;