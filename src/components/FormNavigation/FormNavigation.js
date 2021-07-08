import { Column, Row, Button, ButtonSet } from "carbon-components-react";

const FormNavigation = ({ next, prev, onNext, onPrev }) => {
  return (
    <Row>
      <Column>
        <ButtonSet>
          {prev && (
            <Button kind="secondary" onClick={onPrev}>
              {prev}
            </Button>
          )}
          <Button onClick={onNext}>{next}</Button>
        </ButtonSet>
      </Column>
    </Row>
  );
};

export default FormNavigation;
