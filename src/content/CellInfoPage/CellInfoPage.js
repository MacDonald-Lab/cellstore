import { React } from 'react';
import { AspectRatio, Breadcrumb, BreadcrumbItem, Grid, Row, Column, Tabs, Tab, Button } from 'carbon-components-react';
import { Link, useParams } from 'react-router-dom';

import { useQuery, gql } from '@apollo/client';
import { Loading, Tile } from 'carbon-components-react';
import { Edit16, TrashCan16 } from '@carbon/icons-react';


const CellInfoPage = (props) => {

  const { id } = useParams()

  const LIBRARY_QUERY = gql`
    query LIBRARY_QUERY($id: String!) {
      rawDnaByJoanCellId(joanCellId: $id){
        donorId
        joanCellId
        yearsWithT2D
        age
        sex
        diabetesStatus
    }
    }`;

  const { loading, error, data } = useQuery(LIBRARY_QUERY, {
    variables: { id: id }
  })

  if (loading) return (<Loading />);          
  if (error) return `Error! ${error.message}`;
  const parse = data.rawDnaByJoanCellId

  if (parse == null) return <h1>Cell {id} not found</h1>

  return (<>
    <Grid>

      <Row className="cell-info-page__banner">
        <Column>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/library">Cell Library</Link>
            </BreadcrumbItem>

          </Breadcrumb>
          <h1>{id}</h1>
        </Column>
        <Column className="cell-info-page__actions">
        <Button
              hasIconOnly
              renderIcon={Edit16}
              tooltipAlignment="center"
              tooltipPosition="bottom"
              iconDescription="Edit"
              kind='ghost'
            />
        <Button
              hasIconOnly
              renderIcon={TrashCan16}
              tooltipAlignment="center"
              tooltipPosition="bottom"
              iconDescription="Delete"
              kind='danger'
            />
        </Column>

      </Row>

      <Row>

        <Column sm={4} md={4} max={4}>
          <Tile >
            <AspectRatio ratio="2x1">
              <h6>GENERAL INFORMATION</h6>
              <p>Joan Cell ID: {parse.joanCellId}</p>
              <p>Donor ID: {parse.donorId}</p>
              <p>Age: {parse.age}</p>
              <p>Sex: {["Female", "Male"][parse.sex]}</p>

            </AspectRatio>
          </Tile>
        </Column>


        <Column sm={4} md={4} max={4}>
          <Tile >
            <AspectRatio ratio="2x1">
              <h6>DIABETES INFORMATION</h6>
              <p>Status: {["None", "Type 2", "Pre-diabetes", "Type 1"][parse.diabetesStatus]}</p>
            </AspectRatio>
          </Tile>

        </Column>
      </Row>

      <Row>
        <Column>
          <Tabs>
            <Tab id="gene-expression" label="Gene Expression">
              <h2>
                Gene Expression
            </h2>
            </Tab>
            <Tab id="e-phys" label="Electrophysiological Data">
              <h2>Electrophysiological Data</h2>
            </Tab>

          </Tabs>
        </Column>
      </Row>
    </Grid>

  </>)
}

export default CellInfoPage;