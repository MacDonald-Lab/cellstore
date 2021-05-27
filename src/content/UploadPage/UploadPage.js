import { React, useState, useEffect } from 'react';
import { Breadcrumb, BreadcrumbItem, Grid, Row, Column, FileUploaderDropContainer, Form, FormGroup, Checkbox, ProgressIndicator, ProgressStep, Button, InlineLoading, FileUploaderItem, Tile, AspectRatio, Dropdown, ButtonSet } from 'carbon-components-react';
import { Link, useParams } from 'react-router-dom'
import papa from 'papaparse'
import { Close16 } from '@carbon/icons-react'
import { flattenDiagnosticMessageText } from 'typescript';


function useForceUpdate() {
  // eslint-disable-next-line
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

const FormProgress = (props) => (
  <ProgressIndicator className="upload-page__progress" currentIndex={props.step}>
    <ProgressStep label="Upload Files" />
    <ProgressStep label="Label Data" />
    <ProgressStep label="Review" />
    <ProgressStep label="Submit into Database" />
  </ProgressIndicator>

)

const UploadPage = () => {


  const findDuplicates = (arr) => {
    const distinct = new Set(arr);        // to improve performance
    const filtered = arr.filter(item => {
      // remove the element from the set on very first encounter
      if (distinct.has(item)) {
        distinct.delete(item);
        return false
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

  // eslint-disable-next-line
  const [fileHeaders, setFileHeaders] = useState(null)
  const [duplicates, setDuplicates] = useState([])


  const { libraryName } = useParams()

  const [library, setLibrary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [columnMappings, setColumnMappings] = useState(null)

  useEffect(() => {

    const fetchData = async () => {
      const response = await fetch('http://localhost:5001/getLibrary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          libraryName: libraryName
        })
      })

      if (response.status !== 404) {
        const parsed = await response.json()
        setLibrary(parsed)
        setColumnMappings(parsed.fields.map(item => ({
          name: item.name,
          friendlyName: item.friendlyName,
          dataType: item.dataType,
          selectedItem: null
        })))
      }

      setLoading(false)
    }

    fetchData()

  }, [libraryName])

  const forceUpdate = useForceUpdate()

  // Upload Handlers
  const handleItemDelete = (evt, { uuid }) => {
    // code for multiple files
    // setUploadedFiles(uploadedFiles.filter((item, index) => index !== parseInt(uuid)))
    setUploadedFile(null)
    setFileHeaders(null)
    for (const column of columnMappings) {
      column.selectedItem = null
    }
    setColumnMappings(columnMappings)

  }

  const handleInitialFileUpload = (evt, { addedFiles }) => {
    setUploading(true)
    setUploadedFile(addedFiles[0])
    papa.parse(addedFiles[0], {
      header: true,
      worker: true, // Don't bog down the main thread if its a big file
      step: function (result, parser) {
        setFileHeaders(Object.keys(result.data).map(key => ({
          nameFromFile: key,
        })))
        setUploading(false)
        parser.abort()
      }
    })
  }
  // const handleFileUploadExpression = (evt, { addedFiles }) => {
  //   setLoading(true)
  //   setUploadedFileExpression(addedFiles[0])
  //   papa.parse(addedFiles[0], {
  //     header: true,
  //     worker: true, // Don't bog down the main thread if its a big file
  //     step: function (results, parser) {

  //       const id = results.data['joan_cell_id']
  //       delete results.data['joan_cell_id']          
  //       addExpression({ variables: {
  //         foreignId: id,
  //         expression: results.data
  //       }})
  //       setLoading(false)
  //       parser.abort()
  //     }
  //   })
  // }
  const handleFileSubmit = () => {
    var count = 0; // cache the running count
    setUploading(true)
    papa.parse(uploadedFile, {
      header: true,
      worker: false,
      step: async (result, parser) => {

        parser.pause()

        var newResult = {}
        for (const column of columnMappings) {
          const value = result.data[column.selectedItem.nameFromFile]
          if (column.dataType === 'int' || column.dataType === 'multiselect') {
            newResult[column.name] = parseInt(value)
          } else {
            newResult[column.name] = value
          }
        }

        await fetch('http://localhost:5001/addItemToLibrary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ libraryName: libraryName, libraryItem: newResult })
        })


        count++;
        console.log('done a cell')
        parser.resume()


      },
      complete: function (results, file) {
        setUploading(false)
        console.log(`finished with ${count} rows`)

      }
    })
  }

  // Library Handlers
  if (loading) return <p>Loading</p>
  if (!library) return <p>Cannot find library with id: {libraryName}</p>


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
            {/* 
            <FormGroup legendText="Select Data Types">
              <Checkbox labelText="Donor Information" />
              <Checkbox labelText="Electrophysiological Data" />
              <Checkbox labelText="Gene Expression" />

            </FormGroup>
 */}

            <FormGroup legendText="Upload .csv Donor Information">
              {
                uploadedFile === null ?
                  <FileUploaderDropContainer
                    labelText="Drag and drop file here or click to upload"
                    accept={['.csv']}
                    multiple={false}
                    name="Upload images"
                    onAddFiles={handleInitialFileUpload}
                  /> : <FileUploaderItem
                    name={uploadedFile.name} key={'u-file'} uuid={'u-file'} status={"edit"} onDelete={handleItemDelete} />

              }

              {loading ? <><p>Processing</p> <InlineLoading /></> : <p>Not processing</p>}
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

        {fileHeaders && columnMappings.map((item, i) => (
          <Column sm={4} md={4} lg={4} key={i} className="upload-page__label">
            <Tile>
              <AspectRatio ratio="2x1">
                <p>{item.friendlyName}</p>

                <Dropdown
                  id={`${i}`}
                  titleText={item.name}
                  label={'Select a value'}
                  items={fileHeaders}
                  warn={duplicates.includes(item.selectedItem)}
                  warnText='Warning: this item has been selected more than once'
                  selectedItem={item.selectedItem}
                  itemToString={(item) => (item ? item.nameFromFile : '')}
                  onChange={({ selectedItem }) => {

                    item.selectedItem = selectedItem
                    setColumnMappings(columnMappings)
                    setDuplicates(findDuplicates(columnMappings.map(item => item.selectedItem)))
                    forceUpdate()

                  }}
                />

                <p>{item.dataType}</p>
                <Button
                  hasIconOnly
                  renderIcon={Close16}
                  kind="ghost"
                  iconDescription="Clear field"
                  onClick={() => {
                    item.selectedItem = null
                    setColumnMappings(columnMappings)
                    setDuplicates(findDuplicates(columnMappings.map(item => item.selectedItem)))
                    forceUpdate()

                  }} />
              </AspectRatio>
            </Tile>
          </Column>
        ))}

      </Row>
      <Row>
        <Column>
          <ButtonSet>
            <Button>Clear settings</Button>
            <Button>Save as template</Button>
            <Button>Use template</Button>
          </ButtonSet>
        </Column>
      </Row>
      <Row>
        <Column>

          <h1>Review</h1>
          {/* <FileUploaderDropContainer
                    labelText="Drag and drop gene expression file here or click to upload"
                    accept={['.csv']}
                    multiple={false}
                    name="Upload images"
                    onAddFiles={handleFileUploadExpression}
                  /> */}

          <FormProgress step={2} />
        </Column>

      </Row>
      <Row>
        <Column>

          <Button onClick={handleFileSubmit}>Upload data</Button>

        </Column>
      </Row>

    </Grid>

  </>)
}

export default UploadPage;