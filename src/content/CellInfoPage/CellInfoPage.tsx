import { AspectRatio, Breadcrumb, BreadcrumbItem, Grid, Row, Column, Tabs, Tab, Button } from 'carbon-components-react';
import { Link, useParams } from 'react-router-dom';

import ModalStateManager from '../../components/ModalStateManager'
import ExportCellModal from '../../components/ExportCellModal'

import { Loading, Tile } from 'carbon-components-react';
import { Download16, Edit16, TrashCan16 } from '@carbon/icons-react';
import DeleteCellModal from '../../components/DeleteCellModal';
import FieldItemView from '../../components/FieldItemView';

import {useFetch} from '../../components/Hooks'

// import DataTypes from '../../dataTypes'



const CellInfoPage = () => {

  const { libraryName, cellId } = useParams<{libraryName: string, cellId: string}>()

  const {loading, data} = useFetch([
      {url: 'getLibrary', params: {libraryName}},
    {url: 'getCell', params: {libraryName, cellId}}
  ])

  const library = data.getLibrary as Library
  const cell = data.getCell

  if (loading) return (<Loading />)
  if (!library || !cell) return <p>Error</p>

  const pkField = library.fields.find(field => field.primaryKey)

  let pkName: string;
  if (pkField) {
    pkName = pkField.name;
  } else return <p>error</p>



  // const views = DataTypes.initViews(libraryName, libraryData)
  const views: any[] = []


  return (<>
    <Grid>
      <Row className="cell-info-page__banner">
        <Column>
          <Breadcrumb>
            <BreadcrumbItem isCurrentPage>
              <>Libraries</>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to={`/library/${library.name}`}>{library.friendlyName}</Link>
            </BreadcrumbItem>
          </Breadcrumb>
          <h1>{cell[pkName]}</h1>
        </Column>
        <Column className="cell-info-page__actions">
          <ModalStateManager renderLauncher={({ setOpen }: any) =>
            <Button
              renderIcon={Download16}
              kind='primary'
              onClick={() => {
                setOpen(true)
              }}>Export to .csv</Button>
          }>
            {(modalProps: any) => <ExportCellModal {...modalProps} id={'placeholder'} library={library}/>}
          </ModalStateManager>

          <Button
            hasIconOnly
            renderIcon={Edit16}
            tooltipAlignment="center"
            tooltipPosition="bottom"
            iconDescription="Edit"
            kind='ghost'
          />
          <ModalStateManager renderLauncher={({ setOpen }: any) =>
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
            {(modalProps: any) => <DeleteCellModal {...modalProps} id={cellId} redirect library={library}/>}
          </ModalStateManager>
        </Column>
      </Row>
      <Row>
        <Column sm={4} md={4} max={4}>
          <Tile >
            <AspectRatio ratio="2x1">
              <h6>CELL INFORMATION</h6>
              {library.fields.map(field => <p>
                <strong>{field.friendlyName}</strong> : <FieldItemView field={field} value={cell[field.name]} />
              </p>)}
            </AspectRatio>
          </Tile>
        </Column>
      </Row>
      <Row>
        <Column>
          <Tabs>
            {views.map((item) => <Tab key={item.id} id={item.id} label={item.friendlyName}>
              <h3>{item.friendlyName}</h3>
              <item.component />
            </Tab>)}
          </Tabs>
        </Column>
      </Row>
    </Grid>

  </>)
}

export default CellInfoPage;