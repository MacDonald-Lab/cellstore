import React from 'react';

import { useHistory } from 'react-router-dom'
import { Grid, Row, Column, ClickableTile, AspectRatio } from 'carbon-components-react';
import { Table32, Add32 } from '@carbon/icons-react';

import SkeletonPages from '../../components/SkeletonPages'

import { useFetch } from '../../components/Hooks.tsx'

const LandingPage = () => {

  const history = useHistory()

  const {loading, data} = useFetch([{url: 'getLibraries'}])
  const libraries = data.getLibraries

  if (loading) return <SkeletonPages page='LandingPage' />
  if (!libraries) return <p>Error</p>

  return (
    <Grid>
      <Row className='landing-page__header'>
        <Column>
          <h4>Overview</h4>
        </Column>
      </Row>

      <Row className='landing-page__library-header'>
        <Column>
          <h1>Libraries</h1>

        </Column>
      </Row>
      <Row condensed>

        {libraries.map((item) =>
          <Column className='landing-page__library-tile' key={item.name} sm={2} md={2} lg={4} max={4}>

            <ClickableTile handleClick={() => history.push(`/library/${item.name}`)}>
              <AspectRatio ratio="2x1">
                <h4>
                  <strong>
                    {item.friendlyName}
                  </strong>
                </h4>
                <p>{item.description}</p>
                <div className="landing-page__table-icon">

                  <Table32 />
                </div>
              </AspectRatio>
            </ClickableTile>
          </Column>
        )}
        <Column sm={2} md={2} lg={4} max={4}>

          <ClickableTile handleClick={() => history.push(`/settings/create`)}>
            <AspectRatio ratio="2x1">
              <div className="landing-page__create-items">

                <h4>
                  Create a new library
                </h4>
                <Add32 />

              </div>

            </AspectRatio>
          </ClickableTile>
        </Column>
      </Row>
    </Grid>
  )
}
export default LandingPage;