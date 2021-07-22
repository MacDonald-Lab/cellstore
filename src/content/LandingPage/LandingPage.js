import React from 'react';

import { useHistory } from 'react-router-dom'
import { Grid, Row, Column, ClickableTile, AspectRatio, Button } from 'carbon-components-react';
import { Table32, Add32 } from '@carbon/icons-react';

import SkeletonPages from '../../components/SkeletonPages'

import { useFetch } from '../../components/Hooks.tsx'
import PageHeader from '../../components/PageHeader';
import PageSection from '../../components/PageSection/PageSection';
import toast from 'react-hot-toast';

const LandingPage = () => {

  const history = useHistory()

  const {loading, data} = useFetch([{url: 'getLibraries'}])
  const libraries = data.getLibraries

  if (loading) return <SkeletonPages page='LandingPage' />
  if (!libraries) return <p>Error</p>

  return (
    <Grid>
      <PageHeader pageTitle='Overview' description="View your libraries." />
      <PageSection title='Libraries' description="All libraries ordered by creation date."/>
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
      <PageSection title="Statistics" description="See how your cell data is performing."/>
      <Button onClick={() => toast("hello!")}>Click me</Button>
      <PageSection title="Quick actions" description="Quickly perform common actions on your libraries."/>
    </Grid>
  )
}
export default LandingPage;