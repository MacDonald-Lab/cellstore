import React, {useState, useEffect} from 'react';

import { useHistory } from 'react-router-dom'
import { Button, Grid, Row, Column, ClickableTile, AspectRatio } from 'carbon-components-react';
import { Add16, Table32 } from '@carbon/icons-react';


const LandingPage = () => {
  
  const history = useHistory()
  const [libraries, setLibraries] = useState(null)
  useEffect(() => {

    const getData = async () => {
      const response = await fetch('http://localhost:5001/getLibraries')
      setLibraries(await response.json())
    }
    getData()
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
              <AspectRatio ratio="4x3">
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
      </Row>
      <Row>
        <Column>
          <Button onClick={() => history.push('/settings/create')} renderIcon={Add16} kind='tertiary'>Create library</Button>
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