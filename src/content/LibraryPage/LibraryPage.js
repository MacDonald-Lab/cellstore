import React from 'react';
import { Grid, Row, Column, Tabs, Tab, Breadcrumb, BreadcrumbItem, UnorderedList, ListItem, Tag } from 'carbon-components-react'

import LibraryTable from '../../components/LibraryTable';
import Filters from '../../components/Filters';
import { useHistory } from 'react-router-dom';
import { Tag16 } from '@carbon/icons-react';

const LibraryPage = () => {

  const history = useHistory()

  // TODO: transform to state and/or db query
  const favourites = [{
    id: '1001200602_A6',
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

  return (
    <Grid>
      <Row className="library-page__banner">

        <Column lg={8}>
          <Breadcrumb>
            <BreadcrumbItem isCurrentPage>
              <>Libraries</>
            </BreadcrumbItem>

          </Breadcrumb>
          <h1>Human Cells</h1>
          <p>This is a description of the human cells page. You can put whatever kind of description you would like here and it will show up underneath the title of the library.</p>
        </Column>

      </Row>

      <Row>
        <Column lg={12} md={12} sm={16}>
          <Tabs type="container">
            <Tab id="all-cells" label="All cells">
              <LibraryTable />
            </Tab>
            <Tab id="advanced-search" label="Advanced search">
              <Filters />

            </Tab>
          </Tabs>

        </Column>
        <Column>

          <br />
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

    </Grid>




  );
};
export default LibraryPage;