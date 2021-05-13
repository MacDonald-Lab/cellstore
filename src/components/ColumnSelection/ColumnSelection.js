import { React, useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client'
import { Button, Checkbox, InlineLoading } from 'carbon-components-react';

const SETTING_LIBRARY_QUERY = gql`
  query SETTING_LIBRARY_QUERY {
    cellstoreByKey(key: "libraries") {
      data
    }
  }
`

const ColumnSelection = () => {

    const [libraries, setLibraries] = useState(null)
    const [selectedColumns, setSelectedColumns] = useState([])

    const [getLibraries, { loading }] = useLazyQuery(SETTING_LIBRARY_QUERY, {
        onCompleted: (d) => {
            const parsed = JSON.parse(d.cellstoreByKey.data)
            setLibraries(parsed)
        }
    })

    const handleCheckbox = (value, id, event) => {
        if (value) setSelectedColumns([...selectedColumns, id])
        else setSelectedColumns(selectedColumns.filter((e) => e !== id))
    }

    if (loading) return <InlineLoading status={'active'} description={'Loading columns'} />
    if (libraries) return (<>
        <strong>{libraries.friendlyName}</strong>
        {libraries.fields.map(field => <Checkbox key={field.name} id={field.name} labelText={field.friendlyName} onChange={handleCheckbox} />)}
    </>)

    return <Button onClick={() => {
        getLibraries()
    }} >Click me!</Button>



}

export default ColumnSelection