import { React, useState } from 'react';
import { Breadcrumb, BreadcrumbItem, Grid, Row, Column, FileUploaderDropContainer, Form, FormGroup, Checkbox, ProgressIndicator, ProgressStep, Button, InlineLoading, FileUploaderItem, Tile, AspectRatio, SelectItem, Select, Dropdown } from 'carbon-components-react';
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

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

const SelectLibrary = (props) => {
  const options = props.options
  const stateOptions = props.stateOptions
  const id = props.id

  const [currentValue, setCurrentValue] = useState(null)
  const forceUpdate = useForceUpdate()

  const handleUpdate = ({ selectedItem }) => {

    setCurrentValue(selectedItem)

    // var index = options.findIndex(element => `${element.nameFromFile}` === currentValue)

    // if (index !== -1){
    //   options[index].used = !options[index].used 
    //   stateOptions(options)
    // }

    // var index = options.findIndex(element => `${element.nameFromFile}` === e.target.value)

    // if (index !== -1){
    //   options[index].used = !options[index].used 
    //   stateOptions(options)
    // }

    // setCurrentValue(e.target.value)
    // forceUpdate()
  }

  return (

    <Dropdown
      id={id}
      titleText="Dropdown label"
      items={options}
      selectedItem={currentValue}
      itemToString={(item) => (item ? item.nameFromFile : '')}
      onChange={handleUpdate}
    />

    // <Select id={id} defaultValue="none" onChange={handleUpdate}>
    //   <SelectItem 
    //     value={currentValue}
    //     text={'NULL'}
    //   />
    //   <SelectItem
    //     value="none"
    //     text="None"
    //   />
    //   {
    //     options.map((item, i) => (
    //       <SelectItem value={item.nameFromFile} disabled={item.used} text={item.nameFromFile} />
    //     ))
    //   }

    // </Select>
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


  const findDuplicates = (arr) => {
        const distinct = new Set(arr);        // to improve performance
    const filtered = arr.filter(item => {
        // remove the element from the set on very first encounter
        if (distinct.has(item)) {
            distinct.delete(item);
        }
        // return the element on subsequent encounters
        else {
            return item;
        }
    });
 
    return [...new Set(filtered)]
  }


  // State counter (pages)


  // States
  const [uploadedFile, setUploadedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fileHeaders, setFileHeaders] = useState(null)
  const [duplicates, setDuplicates] = useState([])

  const [columns, setColumns] = useState([{
    name: 'a',
    friendlyName: 'Column A',
    selectedItem: null
  }, {
    name: 'b',
    friendlyName: 'Column B',
    selectedItem: null
  }, {
    name: 'c',
    friendlyName: 'Column C',
    selectedItem: null
  }, {
    name: 'd',
    friendlyName: 'Column D',
    selectedItem: null
  },

  ]
  )

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


  const forceUpdate = useForceUpdate()

  const handleUpdate = ({ selectedItem }) => {

    // setCurrentValue(selectedItem)
  }



  // Upload Handlers
  const handleItemDelete = (evt, { uuid }) => {
    // code for multiple files
    // setUploadedFiles(uploadedFiles.filter((item, index) => index !== parseInt(uuid)))
    setUploadedFile(null)
    setFileHeaders(null)

  }

  const handleFileUpload = (evt, { addedFiles }) => {
    setLoading(true)
    setUploadedFile(addedFiles[0])
    papa.parse(addedFiles[0], {
      header: true,
      worker: true, // Don't bog down the main thread if its a big file
      step: function (result, parser) {
        setFileHeaders(Object.keys(result.data).map(key => ({
          nameFromFile: key,
                })))
        setLoading(false)
        parser.abort()
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
        // }
        count++;
      },
      complete: function (results, file) {
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

        {fileHeaders && columns.map((item, i) => (
          <Column sm={4} md={4} lg={4} className="upload-page__label">
            <Tile>
              <AspectRatio ratio="2x1">
                <p>{item.friendlyName}</p>

                <Dropdown
                  id={i}
                  titleText={item.name}
                  items={fileHeaders}
                  warn={duplicates.includes(item.selectedItem)}
                  warnText='Warning: this item has been selected more than once'
                  selectedItem={item.selectedItem}
                  itemToString={(item) => (item ? item.nameFromFile : '')}
                  onChange={({selectedItem}) => {
                    
                    const temp = columns
                    temp[i].selectedItem = selectedItem
                    setColumns(temp)
                    console.log(findDuplicates(temp.map(item => item.selectedItem)))
                    setDuplicates(findDuplicates(temp.map(item => item.selectedItem)))
                    forceUpdate()

                    // checkWarnings()

                  }}
                />
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