import { InlineNotification } from "carbon-components-react";

const InlineMessage = ({ permanent, close, type, title, detail }) => {
  return (
    <InlineNotification
      style={permanent ? { margin: 0 } : {}}
      hideCloseButton={permanent}
      onCloseButtonClick={close}
      kind={type}
      title={title}
      subtitle={detail}
    />
  );
};

export default InlineMessage;
