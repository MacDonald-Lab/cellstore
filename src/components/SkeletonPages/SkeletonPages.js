import {
  Grid,
  Row,
  Column,
  SkeletonText,
  SkeletonPlaceholder,
  AspectRatio,
  DataTableSkeleton,
  BreadcrumbSkeleton,
  TabsSkeleton,
  TagSkeleton,
  ButtonSkeleton,
} from "carbon-components-react";

const SkeletonPages = ({ page }) => {
  switch (page) {
    case "LandingPage":
      return (
        <Grid>
          <Row className="landing-page__header">
            <Column>
              <SkeletonText heading width="14em" />
            </Column>
          </Row>
          <Row className="landing-page__library-header">
            <Column>
              <h1>
                <SkeletonText heading width="24em" />
              </h1>
            </Column>
          </Row>
          <Row condensed>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Column
                className="landing-page__libraryTile"
                key={item}
                sm={2}
                md={2}
                lg={4}
                max={4}
              >
                <AspectRatio ratio="2x1">
                  <SkeletonPlaceholder style={{ width: "100%" }} />
                </AspectRatio>
              </Column>
            ))}
          </Row>
        </Grid>
      );
    case "LibraryPage":
      return (
        <Grid>
          <Row className="library-page__banner">
            <Column lg={8}>
              <BreadcrumbSkeleton style={{ marginBottom: "1em" }} />
              <SkeletonText
                heading
                width="24em"
                style={{ marginBottom: "1em" }}
              />
              <SkeletonText paragraph lineCount={4} width="36em" />
            </Column>
          </Row>
          <Row>
            <Column lg={12} md={12} sm={16}>
              <TabsSkeleton type="container" />
              <DataTableSkeleton showHeader={false} />
            </Column>
            <Column className="library-page__side-column">
              <SkeletonText heading />
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                <TagSkeleton style={{ width: item * 16 }} key={item} />
              ))}
              <SkeletonText heading />
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                <TagSkeleton style={{ width: item * 16 }} key={item} />
              ))}
            </Column>
          </Row>
        </Grid>
      );
    case "CellInfoPage":
      return (
        <Grid>
          <Row className="cell-info-page__banner">
            <Column>
              <BreadcrumbSkeleton style={{ marginBottom: "1em" }} />
              <SkeletonText
                heading
                width="36em"
                style={{ marginBottom: "1em" }}
              />
            </Column>
            <Column className="cell-info-page__actions">
              <ButtonSkeleton />
            </Column>
          </Row>
          <Row>
            <Column sm={4} md={4} max={4}>
              <AspectRatio ratio="2x1">
                <SkeletonPlaceholder style={{ width: "100%" }} />
              </AspectRatio>
            </Column>
          </Row>
        </Grid>
      );
    default:
      return <p>Loading...</p>;
  }
};

export default SkeletonPages;
