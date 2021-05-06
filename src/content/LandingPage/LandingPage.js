import React from 'react';

import { useHistory } from 'react-router-dom'
import { Button, Grid, Row, Column } from 'carbon-components-react';


const LandingPage = () => {

  const history = useHistory()

  return (
    <Grid>
      <Row className='landing-page__header'>
        <Column>
          <h1>Welcome to CellSTORE!</h1>
        </Column>
      </Row>
      <Row>
        <Column>
          <Button onClick={() => history.push('/library')}>Go to Cell Library</Button>
        </Column>
      </Row>
    </Grid>
  )
}
export default LandingPage;