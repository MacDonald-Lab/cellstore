import { React, useState } from "react";
import {
  Grid,
  Row,
  Column,
  FileUploaderDropContainer,
  Form,
  FormGroup,
  ProgressIndicator,
  ProgressStep,
  Button,
  InlineLoading,
  FileUploaderItem,
  Tile,
  AspectRatio,
  Dropdown,
  ButtonSet,
} from "carbon-components-react";
import { Link, useParams, useHistory } from "react-router-dom";
import papa from "papaparse";
import { Close16 } from "@carbon/icons-react";
import { useForceUpdate, useFetch, useAPI } from "../../components/Hooks.tsx";
import PageHeader from "../../components/PageHeader";
import FormNavigation from "../../components/FormNavigation";
import PageSection from "../../components/PageSection/PageSection";

const FormProgress = (props) => (
  <ProgressIndicator
    className="upload-page__progress"
    currentIndex={props.step}
  >
    <ProgressStep label="Upload Files" />
    <ProgressStep label="Label Data" />
    <ProgressStep label="Review" />
    <ProgressStep label="Submit into Database" />
  </ProgressIndicator>
);

const UploadPage = () => {
  const history = useHistory();

  const findDuplicates = (arr) => {
    const distinct = new Set(arr); // to improve performance
    const filtered = arr.filter((item) => {
      // remove the element from the set on very first encounter
      if (distinct.has(item)) {
        distinct.delete(item);
        return false;
      }
      // return the element on subsequent encounters
      else {
        return item;
      }
    });

    return [...new Set(filtered)];
  };

  // States
  const [uploadedFile, setUploadedFile] = useState(null);

  // eslint-disable-next-line
  const [fileHeaders, setFileHeaders] = useState(null);
  const [duplicates, setDuplicates] = useState([]);

  const { libraryName } = useParams();

  const [uploading, setUploading] = useState(false);
  const [columnMappings, setColumnMappings] = useState(null);

  const [page, setPage] = useState(0);

  const { loading, data } = useFetch(
    [{ url: "getLibrary", params: { libraryName } }],
    (data) => {
      setColumnMappings(
        data.getLibrary.fields.map((item) => ({
          name: item.name,
          friendlyName: item.friendlyName,
          dataType: item.dataType,
          selectedItem: null,
        }))
      );
    }
  );

  const [addItemToLibrary] = useAPI({ url: "addItemToLibrary" });

  const library = data.getLibrary;

  const forceUpdate = useForceUpdate();

  // Upload Handlers
  const handleItemDelete = (evt, { uuid }) => {
    // code for multiple files
    // setUploadedFiles(uploadedFiles.filter((item, index) => index !== parseInt(uuid)))
    setUploadedFile(null);
    setFileHeaders(null);
    for (const column of columnMappings) {
      column.selectedItem = null;
    }
    setColumnMappings(columnMappings);
  };

  const handleInitialFileUpload = (evt, { addedFiles }) => {
    setUploading(true);
    setUploadedFile(addedFiles[0]);
    papa.parse(addedFiles[0], {
      header: true,
      worker: true, // Don't bog down the main thread if its a big file
      step: function (result, parser) {
        setFileHeaders(
          Object.keys(result.data).map((key) => ({
            nameFromFile: key,
          }))
        );
        setUploading(false);
        parser.abort();
      },
    });
  };
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
    setUploading(true);
    papa.parse(uploadedFile, {
      header: true,
      worker: false,
      step: async (result, parser) => {
        parser.pause();

        var newResult = {};
        for (const column of columnMappings) {
          const value = result.data[column.selectedItem.nameFromFile];
          if (column.dataType === "int" || column.dataType === "multiselect") {
            newResult[column.name] = parseInt(value);
          } else {
            newResult[column.name] = value;
          }
        }

        await addItemToLibrary({ libraryName, libraryItem: newResult });

        count++;
        parser.resume();
      },
      complete: function (results, file) {
        setUploading(false);
        console.log(`finished with ${count} rows`);
        history.push("/library/" + libraryName);
      },
    });
  };

  // Library Handlers
  if (loading) return <p>Loading</p>;
  if (!library) return <p>Cannot find library with id: {libraryName}</p>;

  const Page1 = () => {
    return (
      <>
        <PageSection
          title="Upload file"
          description="Drag and drop your .csv format files below to upload."
        />
        <Row>
          <Column>
            <Form>
              <FormGroup legendText="Upload .csv cell information">
                {uploadedFile === null ? (
                  <FileUploaderDropContainer
                    labelText="Drag and drop file here or click to upload"
                    accept={[".csv"]}
                    multiple={false}
                    name="Upload images"
                    onAddFiles={handleInitialFileUpload}
                  />
                ) : (
                  <FileUploaderItem
                    name={uploadedFile.name}
                    key={"u-file"}
                    uuid={"u-file"}
                    status={"edit"}
                    onDelete={handleItemDelete}
                  />
                )}

                {loading ? (
                  <>
                    <p>Processing</p> <InlineLoading />
                  </>
                ) : (
                  <p>Not processing</p>
                )}
              </FormGroup>

              <FormNavigation
                next="Continue to label data"
                onNext={() => setPage(1)}
              />
            </Form>
          </Column>
        </Row>
      </>
    );
  };

  const Page2 = () => {
    return (
      <>
        <PageSection
          title="Label data"
          description="Enter the column name to label the data with."
        />
        <Row>
          {fileHeaders &&
            columnMappings.map((item, i) => (
              <Column
                sm={4}
                md={4}
                lg={4}
                key={i}
                className="upload-page__label"
              >
                <Tile>
                  <AspectRatio ratio="2x1">
                    <p>{item.friendlyName}</p>

                    <Dropdown
                      id={`${i}`}
                      titleText={item.name}
                      label={"Select a value"}
                      items={fileHeaders}
                      warn={duplicates.includes(item.selectedItem)}
                      warnText="Warning: this item has been selected more than once"
                      selectedItem={item.selectedItem}
                      itemToString={(item) => (item ? item.nameFromFile : "")}
                      onChange={({ selectedItem }) => {
                        item.selectedItem = selectedItem;
                        setColumnMappings(columnMappings);
                        setDuplicates(
                          findDuplicates(
                            columnMappings.map((item) => item.selectedItem)
                          )
                        );
                        forceUpdate();
                      }}
                    />

                    <p>{item.dataType}</p>
                    <Button
                      hasIconOnly
                      renderIcon={Close16}
                      kind="ghost"
                      iconDescription="Clear field"
                      onClick={() => {
                        item.selectedItem = null;
                        setColumnMappings(columnMappings);
                        setDuplicates(
                          findDuplicates(
                            columnMappings.map((item) => item.selectedItem)
                          )
                        );
                        forceUpdate();
                      }}
                    />
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
        <FormNavigation
          next="Continue to review"
          prev="Return to upload files"
          onNext={() => setPage(2)}
          onPrev={() => setPage(0)}
        />
      </>
    );
  };

  const Page3 = () => {
    return (
      <>
        <PageSection
          title="Review data"
          description="Review the data you've uploaded."
        />
        <FormNavigation
          prev="Return to label data"
          onPrev={() => setPage(1)}
          next="Upload data"
          onNext={handleFileSubmit}
        />
      </>
    );
  };
  const PageRenderer = () => {
    switch (page) {
      case 0:
        return <Page1 />;
      case 1:
        return <Page2 />;
      case 2:
        return <Page3 />;
      default:
        return <p>Unknown page</p>;
    }
  };

  return (
    <>
      <Grid>
        <PageHeader
          pageTitle="Upload to cell library"
          breadcrumbs={[
            { label: "Libraries", url: "/" },
            { label: library.friendlyName, url: "/library/" + libraryName },
          ]}
        >
          <FormProgress step={page} />
          {uploading && <p>Uploading...</p>}
        </PageHeader>
        <PageRenderer />
      </Grid>
    </>
  );
};

export default UploadPage;
