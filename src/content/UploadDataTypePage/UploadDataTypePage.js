import { useFetch } from "../../components/Hooks.tsx";
import { useParams, useHistory } from "react-router-dom";
import {
  Grid,
  Row,
  Column,
  FileUploaderDropContainer,
  FileUploaderItem,
  Button,
} from "carbon-components-react";
import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import PageSection from "../../components/PageSection/PageSection";
import SkeletonPages from "../../components/SkeletonPages";

import Types from "../../dataTypes/index";
import { useForceUpdate, useAPI } from "../../components/Hooks";

const UploadDataTypePage = () => {
  const [upload] = useAPI({ url: "addDataTypeItemsToLibrary" });
  const forcePageUpdate = useForceUpdate();
  const history = useHistory();
  const { libraryName } = useParams();
  const [uploadedFiles, setUploadedFiles] = useState({});

  const { loading, data } = useFetch([
    { url: "getLibrary", params: { libraryName } },
  ]);

  const { getLibrary: library } = data;

  if (loading) {
    return <SkeletonPages page="UploadDataTypePage" />;
  }
  if (!library) {
    return <p>Error</p>;
  }

  return (
    <Grid>
      <PageHeader
        pageTitle="Upload data types"
        breadcrumbs={[
          { label: "Libraries", url: `/` },
          { label: libraryName, url: `/library/${libraryName}` },
          { label: "Upload", url: `/library/${libraryName}/upload` },
        ]}
      />

      <PageSection title="Data types" />

      {library.dataTypes.map((type) => {
        const def = Types.getDefinition(type);
        const onAdd = Types.getOnAdd(type);
        const typeObj = Types.getType(type);

        return (
          <Row>
            <Column>
              <def.icon />
              <h4>{def.name}</h4>
              <p>{def.description}</p>
            </Column>
            <Column>
              {!(def.id in uploadedFiles) ? (
                <FileUploaderDropContainer
                  label="Drag and drop your files here"
                  multiple={false}
                  name={`Upload data type - ${def.id}`}
                  onAddFiles={(evt, { addedFiles }) => {
                    setUploadedFiles({
                      ...uploadedFiles,
                      [def.id]: onAdd(addedFiles),
                    });
                  }}
                />
              ) : (
                <>
                  <FileUploaderItem
                    name={uploadedFiles[def.id].name}
                    key={`u-file-${def.id}`}
                    uuid={`u-file-${def.id}`}
                    status={"edit"}
                    onDelete={() => {
                      delete uploadedFiles[def.id];
                      setUploadedFiles(uploadedFiles);
                      console.log(uploadedFiles);
                      forcePageUpdate();
                    }}
                  />
                  <Button
                    onClick={() => {
                      typeObj.onSubmit(uploadedFiles[def.id], (data) => {
                        upload({
                          libraryName,
                          libraryDataType: def.id,
                          libraryItems: data,
                        });
                      });
                    }}
                  >
                    Upload files
                  </Button>
                </>
              )}
            </Column>
          </Row>
        );
      })}
    </Grid>
  );
};

export default UploadDataTypePage;
