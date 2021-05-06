import React from 'react';
import LibraryTable from '../../components/LibraryTable';
import { Grid, Row, Column, Tabs, Tab } from 'carbon-components-react'


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
            <Tab id="all-cells" label="All Cells">
              <LibraryTable />
           </Tab>
           <Tab id="advanced-search" label="Advanced Search">
              <h2>Advanced Search</h2>

           </Tab>
          </Tabs>

        </Column>

      </Row>

    </Grid>




  );
};
export default LibraryPage;