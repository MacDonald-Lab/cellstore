import { Search16, Erase16 } from '@carbon/icons-react';
import { Button, ButtonSet, Checkbox, Tile, TextInput, Dropdown } from 'carbon-components-react';
import { React, useState } from 'react';

const Filters = ({ library }) => {

    const FILTER_OPTIONS = {
        string: [
            {
                text: 'Equals',
                value: 'eq'
            },
            {
                text: 'Does not equal',
                value: 'ne'
            },
            {
                text: 'Like (SQL operator)',
                value: 'like'
            },
            {
                text: 'Not Like (SQL operator)',
                value: 'notLike'
            },
            {
                text: 'Starts with',
                value: 'startsWith'
            },
            {
                text: 'Ends with',
                value: 'endsWith'
            },
            {
                text: 'Contains (substring)',
                value: 'substring'
            },
            {
                text: 'Equals',
                value: 'eq'
            },
            {
                text: 'Regex',
                value: 'regexp'
            },
            {
                text: 'Not regex',
                value: 'notRegexp'
            },

        ],

        int: [
            {
                text: 'Equals',
                value: 'eq'
            },
            {
                text: 'Does not equal',
                value: 'ne'
            },
            {
                text: 'Greater than',
                value: 'gt'
            },
            {
                text: 'Greater than or equal to',
                value: 'gte'
            },
            {
                text: 'Less than',
                value: 'lt'
            },
            {
                text: 'Less than or equal to',
                value: 'lte'
            },

        ]
    }

    const defaultFilter = library.fields.map(({ name, dataType }) => ({
        name: name,
        dataType: dataType,
        filter: null
    }))

    const [filters, setFilters] = useState(defaultFilter)


    return (
        <Tile className="filters__main-tile">

            <h3>Filters</h3>

            <br />
            <br />

            {library['fields'].map((item, i) => {

                const { dataType, friendlyName } = item
                const header = <><h6>{friendlyName}</h6><br /></>

                if (dataType === 'int' || dataType === 'string') return <>
                    {header}
                    <Dropdown light id={i} titleText={friendlyName + ' operator'} label={'Select a value'} items={FILTER_OPTIONS[dataType]} itemToString={item => (item ? item['text'] : '')} />
                    <TextInput labelText={friendlyName + ' value'} id={i} light />
                    <br />
                </>
                if (dataType === 'multiselect') return <>
                    {header}
                    {item.multiselectOptions.map(({ friendlyName: optionName }, j) =>
                        <Checkbox labelText={optionName} id={`${i}-${j}`} key={`${i}-${j}`} />
                    )}
                    <br />
                </>


                return <h6>{friendlyName}: Unknown Type</h6>
            })}

            <ButtonSet>
                <Button kind="secondary" onClick={() => setFilters(defaultFilter)} renderIcon={Erase16}>Clear Filters</Button>
                <Button renderIcon={Search16}>Search</Button>
            </ButtonSet>

        </Tile>
    )
}

export default Filters