import React from "react";
import {
  Grid,
  Row,
  Column,
  Tabs,
  Tab,
  Tag,
  Button,
  ButtonSet,
} from "carbon-components-react";
import { useParams } from "react-router-dom";

import LibraryTable from "../../components/LibraryTable";
import Filters from "../../components/Filters";
import { useHistory } from "react-router-dom";
import { Tag16 } from "@carbon/icons-react";

import { useFetch } from "../../components/Hooks.tsx";
import ModalStateManager from "../../components/ModalStateManager";
import RunComputationModal from "../../components/RunComputationModal";
import DeleteLibraryModal from "../../components/DeleteLibraryModal";
import SkeletonPages from "../../components/SkeletonPages";
import PageHeader from "../../components/PageHeader";
import PageSection from "../../components/PageSection/PageSection";

const LibraryPage = () => {
  const history = useHistory();
  const { libraryName } = useParams();

  const { loading, data } = useFetch([
    { url: "getLibrary", params: { libraryName } },
    { url: "getLibraryData", params: { libraryName } },
  ]);

  const library = data.getLibrary;
  const libraryData = data.getLibraryData;

  // TODO: transform to state and/or db query
  const favourites = [
    {
      id: "1001200609_C6",
      color: "magenta",
    },
    {
      id: "1001200602_B6",
      color: "red",
    },
    {
      id: "1001200602_H7",
      color: "blue",
    },
    {
      id: "1001200610_C11",
      color: "green",
    },
  ];

  const tags = [
    {
      id: "to-process",
      color: "magenta",
      count: 0,
    },
    {
      id: "processed",
      color: "red",
      count: 47,
    },
    {
      id: "export-for-lab-XYZ",
      color: "blue",
      count: 50,
    },
    {
      id: "unusable",
      color: "green",
      count: 487,
    },
  ];

  if (loading) return <SkeletonPages page="LibraryPage" />;
  if (!library || !libraryData)
    return <p>Cannot find library with id: {libraryName}</p>;

  return (
    <Grid>
      <PageHeader
        breadcrumbs={[{ label: "Libraries", url: "/" }]}
        pageTitle={library.friendlyName}
        description={library.description}
      />

      <Row>
        <Column lg={12} md={12} sm={16}>
          <Tabs type="container">
            <Tab id="all-cells" label="All cells">
              <LibraryTable library={library} libraryData={libraryData} />
            </Tab>
            <Tab id="advanced-search" label="Advanced search">
              <Filters library={library} />
            </Tab>
          </Tabs>
        </Column>
        <Column className="library-page__side-column">
          <PageSection title="Computations" />
          <ModalStateManager
            renderLauncher={({ setOpen }) => (
              <Button onClick={() => setOpen(true)}>
                Run computation on library
              </Button>
            )}
          >
            {(modalProps) => (
              <RunComputationModal {...modalProps} library={library} />
            )}
          </ModalStateManager>

          {favourites.length > 0 && (
            <>
              <PageSection title="Favourites" />

              {favourites.map((item) => (
                <Tag
                  key={item.id}
                  type={item.color}
                  onClick={() => history.push(`/library/cell/${item.id}`)}
                >
                  {item.id}
                </Tag>
              ))}
            </>
          )}

          {tags.length > 0 && (
            <>
              <PageSection title="Tags" />
              {tags.map((item) => (
                <Tag
                  key={item.id}
                  type={item.color}
                  renderIcon={Tag16}
                  onClick={() => history.push(`/library/tags/${item.id}`)}
                >
                  {item.id} <strong>{item.count}</strong>
                </Tag>
              ))}
            </>
          )}
        </Column>
      </Row>
      <PageSection title="Library options" />
      <Row>
        <Column>
          <ButtonSet>
            <Button>Edit settings</Button>
            <Button>Export library</Button>
            <ModalStateManager
              renderLauncher={({ setOpen }) => (
                <Button onClick={() => setOpen(true)}>Delete library</Button>
              )}
            >
              {(modalProps) => (
                <DeleteLibraryModal {...modalProps} library={library} />
              )}
            </ModalStateManager>
          </ButtonSet>
        </Column>
      </Row>
    </Grid>
  );
};
export default LibraryPage;
