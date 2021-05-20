import { React } from 'react';
import { AspectRatio, Breadcrumb, BreadcrumbItem, Grid, Row, Column, Tabs, Tab, Button, Tag } from 'carbon-components-react';
import { Link, useParams } from 'react-router-dom';

import ModalStateManager from '../../components/ModalStateManager'
import ExportCellModal from '../../components/ExportCellModal'

import { useQuery, gql } from '@apollo/client';
import { Loading, Tile } from 'carbon-components-react';
import { Download16, Edit16, TrashCan16 } from '@carbon/icons-react';
import DeleteCellModal from '../../components/DeleteCellModal';
import DataTypes from '../../dataTypes'

const CellInfoPage = () => {

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


  if (parse == null) return <h1>Cell {id} not found</h1>

  const views = DataTypes.initViews('humanCells', data)


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
            {views.map((item) => <Tab key={item.id} id={item.id} label={item.friendlyName}>
              <h3>{item.friendlyName}</h3>
              <br />
              <item.component />
            </Tab>)}
          </Tabs>
        </Column>
      </Row>
    </Grid>

  </>)
}

export default CellInfoPage;