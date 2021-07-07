import { Row, Column } from "carbon-components-react";

const PageSection = ({ title, description, children }) => {
  return (
    <>
      <Row className="page-section">
        <Column>
          <h2>{title}</h2>
          <p>{description}</p>
        </Column>
      </Row>
      {children}
    </>
  );
};

export default PageSection;
