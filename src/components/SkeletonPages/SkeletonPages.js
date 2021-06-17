import { Grid, Row, Column, SkeletonText, SkeletonPlaceholder, AspectRatio } from "carbon-components-react";

const SkeletonPages = ({ page }) => {
  switch (page) {
    case "LandingPage":
      return (
        <Grid>
          <Row className='landing-page__header'>
            <Column>
              <SkeletonText heading width="14em"/>
            </Column>
          </Row>
	  <Row className='landing-page__library-header'>
		  <Column>
		  <h1>
			  <SkeletonText heading width="24em" />
		  </h1>
		  </Column>

	  </Row>
	  <Row condensed>
		  {[1,2,3,4,5,6,7,8].map((item) => <Column className='landing-page__libraryTile' key={item} sm={2} md={2} lg={4} max={4}>

			<AspectRatio ratio="2x1">
				<SkeletonPlaceholder style={{width: '100%'}}/>
			</AspectRatio>

		  </Column>)}

	  </Row>
        </Grid>
      );
    default:
      return <p>Loading...</p>;
  }
};

export default SkeletonPages;
