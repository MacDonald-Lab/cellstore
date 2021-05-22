import { React, useState, useEffect } from 'react';
import { AspectRatio, Breadcrumb, BreadcrumbItem, Grid, Row, Column, Tabs, Tab, Button, Tag } from 'carbon-components-react';
import { Link, useParams } from 'react-router-dom';

import ModalStateManager from '../../components/ModalStateManager'
import ExportCellModal from '../../components/ExportCellModal'

import { Loading, Tile } from 'carbon-components-react';
import { Download16, Edit16, TrashCan16 } from '@carbon/icons-react';
import DeleteCellModal from '../../components/DeleteCellModal';
import FieldItemView from '../../components/FieldItemView';
import DataTypes from '../../dataTypes'



const CellInfoPage = () => {

  const { libraryName, cellId } = useParams()

  const [library, setLibrary] = useState(null)
  const [cell, setCell] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {

    const fetchData = async () => {
      const response = await fetch('http://localhost:5001/getLibrary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          libraryName: libraryName
        })
      })

      if (response.status !== 404) setLibrary(await response.json())

      const response2 = await fetch('http://localhost:5001/getCell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          libraryName: libraryName,
          cellId: cellId
        })
      })

      if (response.status !== 404) setCell(await response2.json())
      setLoading(false)
    }

    fetchData()

  }, [])

  if (loading) return (<Loading />)
  if (!library || !cell) return <p>Error</p>

  const pkName = library.fields.find(field => field.primaryKey === true).name

  // const views = DataTypes.initViews(libraryName, libraryData)
  const views = []


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
          <h1>{cell[pkName]}</h1>
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
            {(modalProps) => <ExportCellModal {...modalProps} id={'placeholder'} />}
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
            {(modalProps) => <DeleteCellModal {...modalProps} id={'placeholder'} redirect />}
          </ModalStateManager>
        </Column>

      </Row>

      <Row>

        <Column sm={4} md={4} max={4}>
          <Tile >
            <AspectRatio ratio="2x1">
              <h6>CELL INFORMATION</h6>
              <br />
              {library.fields.map(field => <p>
                <strong>{field.friendlyName}</strong> : <FieldItemView field={field} cell={cell} />
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