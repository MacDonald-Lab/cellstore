import { Search16, Erase16 } from '@carbon/icons-react';
import { Button, ButtonSet, Checkbox, Tile, TextInput, Dropdown, Column, Row } from 'carbon-components-react';
import { useState } from 'react';
import LibraryTable from '../../components/LibraryTable'

import { useForceUpdate, useAPI } from '../../components/Hooks.tsx'

const Filters = ({ library }) => {

    const [getFilteredCells] = useAPI({url: 'getFilteredCells'})

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

    const defaultFilter = library.fields.map(({ name, dataType }) => {

        var filterValue = null

        if (dataType === 'multiselect') filterValue = []
        if (dataType === 'int' || dataType === 'string') filterValue = {
            value: '',
            operator: {
                text: 'Select a value',
                value: null
            },
        }

        return {
            name: name,
            dataType: dataType,
            filter: filterValue
        }
    })

    const forceUpdate = useForceUpdate()
    const [filters, setFilters] = useState(defaultFilter)
    const [results, setResults] = useState(null)

    const handleCheckbox = (value, id) => {
        const fieldId = parseInt(id.split('-')[0])
        const optionId = parseInt(id.split('-')[1])

        if (value) {
            filters[fieldId]['filter'].push(library.fields[fieldId]['multiselectOptions'][optionId]['storedAs'])
        } else {
            filters[fieldId]['filter'] = filters[fieldId]['filter'].filter(item => item !== library.fields[fieldId]['multiselectOptions'][optionId]['storedAs'])
        }

        setFilters(filters)
        forceUpdate()
    }

    const handleTextField = (e) => {

        const id = parseInt(e.target.id)
        var value = e.target.value

        if (value === '') value = null
        filters[id]['filter']['value'] = value

        setFilters(filters)
        forceUpdate()

    }

    const handleSubmit = async () => {

        // cleanup of filter state object
        const submitArray = filters
            .filter(item => item.dataType !== 'multiselect' || item.filter.length > 0) // get rid of empty multiselect arrays
            .filter(item => (item.dataType !== 'int' && item.dataType !== 'string') || (item.filter.operator.value !== null && item.filter.value !== null)) // get rid of inputs where operator selector  is null

        // FIXME display error if int is not int

        await getFilteredCells({ libraryName: library.name, filters: submitArray }, setResults)
    
    }

    return (<>
        <Tile className="filters__main-tile">

            <h3>Filters</h3>

            <br />
            <br />

            {library['fields'].map((item, i) => {

                const { dataType, friendlyName } = item
                const header = <Row><Column><h6>{friendlyName}</h6><br /></Column></Row>

                if (dataType === 'int' || dataType === 'string') return <>


                    {header}
                    <Row>
                        <Column>
                            <Dropdown light id={i} titleText={friendlyName + ' operator'} label={'Select a value'} items={FILTER_OPTIONS[dataType]} itemToString={item => (item ? item['text'] : '')} selectedItem={filters[i].filter.operator} onChange={(item) => {
                                filters[i]['filter']['operator'] = item['selectedItem']
                                setFilters(filters)
                                forceUpdate()
                            }} />
                        </Column>
                        <Column>
                            <TextInput labelText={friendlyName + ' value'} id={i} light onChange={handleTextField} value={filters[i]['filter']['value']} />
                        </Column>
                        <br />

                    </Row>
                </>
                if (dataType === 'multiselect') return <>
                    {header}
                    {item.multiselectOptions.map(({ friendlyName: optionName, storedAs }, j) =>


                        <Checkbox labelText={optionName} id={`${i}-${j}`} key={`${i}-${j}`} checked={filters[i]['filter'].includes(storedAs)} onChange={handleCheckbox} />
                    )}
                    <br />
                </>


                return <h6>{friendlyName}: Unknown Type</h6>
            })}

            <ButtonSet>
                <Button kind="secondary" onClick={() => setFilters(defaultFilter)} renderIcon={Erase16}>Clear Filters</Button>
                <Button renderIcon={Search16} onClick={handleSubmit}>Search</Button>
            </ButtonSet>

        </Tile>

        {results && <LibraryTable library={library} libraryData={results} />}
    </>
    )
}

export default Filters