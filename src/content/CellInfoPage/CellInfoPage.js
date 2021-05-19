import { React } from 'react';
import { AspectRatio, Breadcrumb, BreadcrumbItem, Grid, Row, Column, Tabs, Tab, Button, Tag } from 'carbon-components-react';
import { Link, useParams } from 'react-router-dom';

import ModalStateManager from '../../components/ModalStateManager'
import ExportCellModal from '../../components/ExportCellModal'

import { useQuery, gql } from '@apollo/client';
import { Loading, Tile } from 'carbon-components-react';
import { Download16, Edit16, TrashCan16 } from '@carbon/icons-react';
import DeleteCellModal from '../../components/DeleteCellModal';
import { SimpleBarChart } from '@carbon/charts-react';


const chartOptions = {
  "title": "Common gene expressions",
  "axes": {
    "left": {
      "mapsTo": "group",
      "scaleType": "labels"
    },
    "bottom": {
      "mapsTo": "value"
    }
  },
  "height": "450px"
}

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
        humanCellsGeneExpressionByForeignId {
          expression
        }
    }
    }`;

  const { loading, error, data } = useQuery(LIBRARY_QUERY, {
    variables: { id: id }
  })

  if (loading) return (<Loading />);
  if (error) return `Error! ${error.message}`;
  const parse = data.rawDnaByJoanCellId
  const arrayGenes = Object.keys(parse.humanCellsGeneExpressionByForeignId.expression).map(key => 
    ({
      "group": key,
      "value": parseInt(parse.humanCellsGeneExpressionByForeignId.expression[key])
    })).sort((a, b) => b.value - a.value)

    const smallArrayGenes = arrayGenes.slice(0, 9)
    const medArrayGenes = arrayGenes.slice(0, 101)

  if (parse == null) return <h1>Cell {id} not found</h1>

  console.log(parse)

  return (<>
    <Grid>

      <Row className="cell-info-page__banner">
        <Column>
          <Breadcrumb>
          <BreadcrumbItem isCurrentPage>
              <>Libraries</>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to="/library">Human Cells</Link>
            </BreadcrumbItem>

          </Breadcrumb>
          <h1>{id}</h1>
        </Column>
        <Column className="cell-info-page__actions">
          <ModalStateManager renderLauncher={({ setOpen }) =>
            <Button
              renderIcon={Download16}
              kind='primary'
              onClick={() => {
                setOpen(true)
              }}>Export to .csv</Button>
          }>
            {(modalProps) => <ExportCellModal {...modalProps} id={parse.joanCellId} />}
          </ModalStateManager>

          <Button
            hasIconOnly
            renderIcon={Edit16}
            tooltipAlignment="center"
            tooltipPosition="bottom"
            iconDescription="Edit"
            kind='ghost'
          />
          <ModalStateManager renderLauncher={({ setOpen }) =>
            <Button
              hasIconOnly
              renderIcon={TrashCan16}
              tooltipAlignment="center"
              tooltipPosition="bottom"
              iconDescription="Delete"
              kind='danger'
              onClick={() => setOpen(true)}
            />
          }>
          {(modalProps) => <DeleteCellModal {...modalProps} id={parse.joanCellId} redirect />}
        </ModalStateManager>
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
                <br />
            {smallArrayGenes &&
            
                <SimpleBarChart data={smallArrayGenes} options={chartOptions} />
              }
              <br />

                {medArrayGenes && <>

                <h4>Top 100 Genes</h4>
                <br />
                

                {medArrayGenes.map(item => <Tag>{item.group} <strong>{item.value}</strong></Tag>)}
                </>
                }

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