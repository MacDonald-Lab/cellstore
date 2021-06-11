import { React } from 'react';
import { Button, ButtonSet, Checkbox } from 'carbon-components-react';


const ColumnSelection = ({library, columns, setColumns}) => {


    const handleCheckbox = (value, id, name) => {
      if (value) setColumns([...columns, name])
       else setColumns(columns.filter(column => column !== name))
    }

    return (<>
        {library.fields.map(field => <Checkbox key={field.name} checked={columns.includes(field.name)} id={field.name} labelText={field.friendlyName} onChange={(value, event) => handleCheckbox(value, event, field.name)} />)}
        <ButtonSet>
          <Button kind='secondary' onClick={() => setColumns([])}>Clear selected</Button>
          <Button onClick={() => setColumns(library.fields.map(field => field.name))}>Select all fields</Button>
        </ButtonSet>
    </>)

}

export default ColumnSelection