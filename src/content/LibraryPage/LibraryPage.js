import React, { useState, useEffect } from 'react';
import { Grid, Row, Column, Tabs, Tab, Breadcrumb, BreadcrumbItem, Tag, DataTableSkeleton, Button, ButtonSet } from 'carbon-components-react'
import { useParams } from 'react-router-dom';

import LibraryTable from '../../components/LibraryTable';
import Filters from '../../components/Filters';
import { useHistory } from 'react-router-dom';
import { Tag16 } from '@carbon/icons-react';

import API from '../../components/API.tsx';
import ModalStateManager from '../../components/ModalStateManager';
import RunComputationModal from '../../components/RunComputationModal';
import DeleteLibraryModal from '../../components/DeleteLibraryModal';

const LibraryPage = () => {

  const history = useHistory()
  const { libraryName } = useParams()

  const [library, setLibrary] = useState(null)
  const [libraryData, setLibraryData] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {

    const get = async () => {

      await API.getLibrary(setLibrary, { libraryName: libraryName })
      await API.getLibraryData(setLibraryData, { libraryName: libraryName })
      setLoading(false)

    }

    get()

  }, [libraryName])

  // TODO: transform to state and/or db query
  const favourites = [{
    id: '1001200609_C6',
    color: 'magenta'
  }, {
    id: '1001200602_B6',
    color: 'red'
  }, {
    id: '1001200602_H7',
    color: 'blue'
  }, {
    id: '1001200610_C11',
    color: 'green'
  }
  ]

  const tags = [
    {
      id: 'to-process',
      color: 'magenta',
      count: 0
    }, {
      id: 'processed',
      color: 'red',
      count: 47
    }, {
      id: 'export-for-lab-XYZ',
      color: 'blue',
      count: 50
    }, {
      id: 'unusable',
      color: 'green',
      count: 487
    }
  ]

  if (loading) return <DataTableSkeleton showHeader={false} />
  if (!library || !libraryData) return <p>Cannot find library with id: {libraryName}</p>

  return (
    <Grid>
      <Row className="library-page__banner">

        <Column lg={8}>
          <Breadcrumb>
            <BreadcrumbItem isCurrentPage>
              <>Libraries</>
            </BreadcrumbItem>

          </Breadcrumb>
          <h1>{library.friendlyName}</h1>
          <p>{library.description}</p>
        </Column>

      </Row>

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
        <Column>

          <br />
          <br />
          <br />

          <h3>Computations</h3>
          <br />
          <ModalStateManager renderLauncher={({ setOpen }) =>
            <Button onClick={() => setOpen(true)}>Run computation on library</Button>
          }>
            {modalProps => <RunComputationModal {...modalProps} library={library} />}
          </ModalStateManager>


          <br />
          <br />

          {favourites.length > 0 && <>
            <h3>Favourites</h3>
            <br />
            {favourites.map(item => <Tag type={item.color} onClick={() => history.push(`/library/cell/${item.id}`)}>{item.id}</Tag>)}


            <br />
            <br />
          </>

          }

          {tags.length > 0 && <>
            <h3>Tags</h3>
            <br />
            {tags.map(item => <Tag type={item.color} renderIcon={Tag16} onClick={() => history.push(`/library/tags/${item.id}`)}>{item.id} <strong>{item.count}</strong></Tag>)}
            <br />
            <br />
          </>

          }
        </Column>

      </Row>
      <Row>
        <Column>
          <h3>Library options</h3>
        </Column>
      </Row>
      <Row>
        <Column>

          <ButtonSet>
            <Button>Edit settings</Button>
            <Button>Export library</Button>
            <ModalStateManager renderLauncher={({ setOpen }) =>
            <Button onClick={() => setOpen(true)}>Delete library</Button>
            }>
              {modalProps => 
              <DeleteLibraryModal {...modalProps} library={library} />
              }
            </ModalStateManager>
          </ButtonSet>
        </Column>
      </Row>

    </Grid>




  );
};
export default LibraryPage;