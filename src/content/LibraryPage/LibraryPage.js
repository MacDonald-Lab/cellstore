import React from 'react';
import LibraryTable from '../../components/LibraryTable';
import { Grid, Row, Column, Tabs, Tab } from 'carbon-components-react'
import Filters from '../../components/Filters';


const LibraryPage = () => {
  return (
    <Grid>
      <Row className="library-page__banner">

        <Column lg={16}>
          <h1>Cell Library</h1>
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