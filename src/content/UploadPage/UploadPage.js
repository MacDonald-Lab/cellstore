import { React, useState } from 'react';
import { Breadcrumb, BreadcrumbItem, Grid, Row, Column, FileUploaderDropContainer, Form, FormGroup, Checkbox, ProgressIndicator, ProgressStep, Button, InlineLoading, FileUploaderItem, Tile, AspectRatio, SelectItem, Select } from 'carbon-components-react';
import { Link } from 'react-router-dom'
import papa from 'papaparse'
import { useMutation, gql } from '@apollo/client';

const ADD_CELL = gql`
  mutation AddCell(
      $joanCellId: String!,
      $diabetesStatus: Int!,
      $yearsWithT2D: Int,
      $age: Int!,
      $sex: Int!,
      $donorId: Int!,
    ) {
    createRawDna(
      joanCellId: $joanCellId,
      diabetesStatus: $diabetesStatus,
      yearsWithT2D: $yearsWithT2D,
      age: $age,
      sex: $sex,
      donorId: $donorId
      ) {
      joanCellId
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
  const [addCell, { data }] = useMutation(ADD_CELL)



  // Upload Handlers
  const handleItemDelete = (evt, { uuid }) => {
    // code for multiple files
    // setUploadedFiles(uploadedFiles.filter((item, index) => index !== parseInt(uuid)))
    setUploadedFile(null)

  }

  const handleFileUpload = (evt, { addedFiles }) => {
    var count = 0; // cache the running count
    console.log(addedFiles[0])
    setLoading(true)
    papa.parse(addedFiles[0], {
      header: false,
      worker: true, // Don't bog down the main thread if its a big file
      step: function (result) {
        if (count === 0) {
          setFileHeaders(result.data)
        }
        count++;
      },
      complete: function (results, file) {
        console.log('parsing complete read', count, 'records.');
        setLoading(false)
        setUploadedFile(addedFiles[0])
      }
    })
  }

  const handleFileSubmit = () => {

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

          </Form>
        </Column>
      </Row>
      <Row>
        <Column>

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