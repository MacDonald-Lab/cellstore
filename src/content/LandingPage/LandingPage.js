import React from 'react';

import { useHistory } from 'react-router-dom'
import { Grid, Row, Column, ClickableTile, AspectRatio } from 'carbon-components-react';
import { Table32, Add32 } from '@carbon/icons-react';

import { useFetch } from '../../components/Hooks.tsx'

const LandingPage = () => {

  const history = useHistory()

  const {loading, data} = useFetch([{url: 'getLibraries'}])
  const libraries = data.getLibraries

  if (loading) return <p>Loading</p>
  if (!libraries) return <p>Error</p>

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
          <Column key={item.name} sm={2} md={4} lg={4} max={3}>

            <ClickableTile handleClick={() => history.push(`/library/${item.name}`)}>
              <AspectRatio ratio="1x1">
                <h4>
                  <strong>
                    {item.friendlyName}
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