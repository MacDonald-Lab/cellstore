import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom'
import { Grid, Row, Column, ClickableTile, AspectRatio } from 'carbon-components-react';
import { Table32, Add32 } from '@carbon/icons-react';

import API from '../../components/API.tsx'

const LandingPage = () => {

  const history = useHistory()
  const [libraries, setLibraries] = useState(null)
  useEffect(() => {
    API.getLibraries(setLibraries).catch(() => history.push('/login') )
  }, [])

  if (!libraries) return <p>Loading...</p>


  return (
    <Grid>
      <Row className='landing-page__header'>
        <Column>
          <h4>Overview</h4>
          <br />
          <br />
        </Column>
      </Row>

      <Row>
        <Column>
          <h1>Libraries</h1>
          <br />

        </Column>
      </Row>
      <Row condensed>

        {libraries.map((item) =>
          <Column sm={2} md={4} lg={4} max={3}>

            <ClickableTile handleClick={() => history.push(`/library/${item.name}`)}>
              <AspectRatio ratio="1x1">
                <h4>
                  <strong>
                    {item['friendlyName']}
                  </strong>
                </h4>
                <br />
                <p>{item.description}</p>
                <div className="landing-page__table-icon">

                  <Table32 />
                </div>
              </AspectRatio>
            </ClickableTile>
          </Column>
        )}
        <Column sm={2} md={4} lg={4} max={3}>

          <ClickableTile handleClick={() => history.push(`/settings/create`)}>
            <AspectRatio ratio="1x1">
              <div className="landing-page__create-items">

                <h4>
                  Create a new library
                </h4>
                <br />
                <Add32 />

              </div>

            </AspectRatio>
          </ClickableTile>
        </Column>
      </Row>

      <Row>
        <Column>
          <h1>Computation Centre</h1>
          <h4>CellSTORE (Cell Storage To Organize Research Everywhere)</h4>

        </Column>
      </Row>
    </Grid>
  )
}
export default LandingPage;