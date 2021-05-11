import React from 'react';
import { Grid, Row, Column, Tabs, Tab, Breadcrumb, BreadcrumbItem } from 'carbon-components-react'

import LibraryTable from '../../components/LibraryTable';
import Filters from '../../components/Filters';

const LibraryPage = () => {
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

      </Row>

    </Grid>




  );
};
export default LibraryPage;