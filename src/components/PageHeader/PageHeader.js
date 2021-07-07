import {
  Breadcrumb,
  BreadcrumbItem,
  Row,
  Column,
} from "carbon-components-react";
import { Link } from "react-router-dom";

const PageHeader = ({
  pageTitle,
  breadcrumbs,
  description,
  children,
}) => {
  // breadcrumbs format:
  // [{label, url}]

  return (
    <>
      <Row className="page-header">
        <Column>
        {breadcrumbs && (
          <Breadcrumb>
            {breadcrumbs.map(({ label, url }) => (
              <BreadcrumbItem key={label}>
                <Link to={url}>{label} </Link>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>)}
          <h1 className="page-header__title">{pageTitle}</h1>
          {description && <p className="page-header__subtitle">{description}</p>}
          {children}
        </Column>
      </Row>
    </>
  );
};

export default PageHeader;
