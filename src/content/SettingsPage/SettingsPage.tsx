import { Download16 } from '@carbon/icons-react';
import { Accordion, AccordionItem, Button, Column, Grid, Row, TextInput, } from 'carbon-components-react';
import { useState } from 'react';
import ExportLibraryModal from '../../components/ExportLibraryModal';
import ModalStateManager from '../../components/ModalStateManager';

import { useFetch, API } from '../../components/Hooks'

const GeneralSettings = () => {

    const [settings, setSettings] = useState<{ [key: string]: any }>()
    const { loading } = useFetch([{ url: 'getSettings' }], (data) =>
        setSettings(data.getSettings)
    )

    if (loading) return <p>Loading...</p>
    else if (!settings) return <p>Error getting settings</p>
    else return <>
        {Object.keys(settings).map((item, i) =>
            <TextInput key={i} id={i.toString()} value={settings[item]} labelText={item} onChange={(e) => {
                settings[item] = e.target.value
                setSettings(settings)
            }} />
        )}
        <Button onClick={async () => {
            await API({ url: 'setSettings', params: {payload: settings}})
            window.location.reload()
        }}>Submit</Button>
    </>
}


const SettingsPage = () => {

    return <Grid>
        <Row>
            <Column>
                <h1>Settings</h1>
            </Column>
        </Row>
        <Row>
            <Column>
                <Accordion>
                    <AccordionItem title="General">
                        <GeneralSettings />
                    </AccordionItem>
                    <AccordionItem title="Libraries">
                        Library settings
                    <ModalStateManager renderLauncher={({ setOpen }: { setOpen: (value: boolean) => void }) =>
                            <Button onClick={() => setOpen(true)} renderIcon={Download16}>Export whole library</Button>
                        }>
                            {(modalProps: { open: boolean, setOpen: (value: boolean) => void }) => <ExportLibraryModal {...modalProps} />}
                        </ModalStateManager>
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