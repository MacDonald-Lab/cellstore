import { Accordion, AccordionItem, Button, Column, Grid, Row, TextInput, } from 'carbon-components-react';
import { useState } from 'react';

import { useFetch, useAPI, useForceUpdate } from '../../components/Hooks'
import PageHeader from '../../components/PageHeader';
import PageSection from '../../components/PageSection/PageSection';

const GeneralSettings = () => {

    const [settings, setSettings] = useState<{ [key: string]: any }>()
    const { loading } = useFetch([{ url: 'getSettings' }], (data) =>
        setSettings(data.getSettings)
    )

    const forceUpdate = useForceUpdate()

    const [submit] = useAPI({url: 'setSettings'})

    if (loading) return <p>Loading...</p>
    else if (!settings) return <p>Error getting settings</p>
    else return <>
        {Object.keys(settings).map((item, i) =>
            <TextInput key={i} id={i.toString()} value={settings[item]} labelText={item} onChange={(e) => {
                settings[item] = e.target.value
                setSettings(settings)
                forceUpdate()
            }} />
        )}
        <Button onClick={async () => {
            await submit({settings})
            window.location.reload()
        }}>Submit</Button>
    </>
}


const SettingsPage = () => {

    return <Grid>
        <PageHeader pageTitle="Settings" description="Edit system-wide settings for CellSTORE." breadcrumbs={false} children/>
        <Row>
            <Column>
                <Accordion>
                    <AccordionItem title="General">
                        <PageSection title="General" description="General settings for CellSTORE." children/>
                        <GeneralSettings />
                    </AccordionItem>
                    <AccordionItem title="Libraries">
                        Library settings
                    </AccordionItem>
                    <AccordionItem title="Users">
                        User account settings
                </AccordionItem>
                </Accordion>

                {/* <StructuredListWrapper>
                    <StructuredListBody>
                        <StructuredListRow>
                            <StructuredListCell>Libraries</StructuredListCell>
                            <StructuredListCell>Description about library settings</StructuredListCell>
                        </StructuredListRow>
                    </StructuredListBody>
                </StructuredListWrapper> */}
            </Column>
        </Row>
    </Grid>

}

export default SettingsPage