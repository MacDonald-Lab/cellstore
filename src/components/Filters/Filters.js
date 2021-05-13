import { Search16, Erase16 } from '@carbon/icons-react';
import { Button, ButtonSet, Checkbox } from 'carbon-components-react';
import { React, useState } from 'react';

const Filters = () => {
    const [filters, setFilters] = useState({})

    const filterDefinitions = [
        {
            name: 'Sex',
            id: 'sex',
            type: 'checkbox',
            options: [
                { name: 'Male', id: 'male' },
                { name: 'Female', id: 'female' }
            ]
        },
        {
            name: 'Diabetes Status',
            id: 'diabetes',
            type: 'checkbox',
            options: [
                { name: 'None', id: 'none' },
                { name: 'Pre-diabetes', id: 'pre' },
                { name: 'Type 1', id: 't1d' },
                { name: 'Type 2', id: 't2d' }
            ]
        }
    ]

    const handleCheckbox = (value, id, event) => {
        // const filter_id = event.nativeEvent.path[2].id // FIXME messy way to do this
        const tempFilters = { ...filters }
        tempFilters[id] = value
        setFilters(tempFilters)
    }

    // TODO refer to other DB filtering options and implement with text fields
    return (
        <>
            <h4>Filters</h4>

            <h5>General Information</h5>
            {filterDefinitions.map((item, i) =>
            <div key={i}>
                    <h6>{item.name}</h6>
                    <div id={item.id}>
                        {item.options.map((filterItem) => <Checkbox labelText={filterItem.name} id={item.id + '-' + filterItem.id} key={item.id + '-' + filterItem.id} onChange={handleCheckbox} />)}
                    </div>
                </div>
            )}

            <ButtonSet>
                <Button kind="secondary" onClick={() => setFilters({})} renderIcon={Erase16}>Clear Filters</Button>
                <Button renderIcon={Search16}>Search</Button>
            </ButtonSet>

        </>
    )
}

export default Filters