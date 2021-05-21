import { Download16 } from '@carbon/icons-react';
import { Accordion, AccordionItem, Button, Column, Grid, Row, TextInput, } from 'carbon-components-react';
import { React, useState, useEffect } from 'react';
import ExportLibraryModal from '../../components/ExportLibraryModal';
import ModalStateManager from '../../components/ModalStateManager';

const GeneralSettings = () => {

    const [settings, setSettings] = useState(null)
    useEffect(async () => {
        const response = await fetch('http://localhost:5001/getSettings')
        setSettings(await response.json())
    }, [])

    if (!settings) return <p>Loading...</p>

    return <> 
    {Object.keys(settings).map((item, i) => 
        <TextInput key={i} value={settings[item]} labelText={item} onChange={(e) => {
            const tempSettings = {...settings}
            tempSettings[item] = e.target.value
            setSettings(tempSettings)
          }}/>
    )}
    <Button onClick={async () => {
        await fetch('http://localhost:5001/setSettings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({payload: settings})
        })

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

                    <ModalStateManager renderLauncher={({ setOpen }) =>
                            <Button onClick={() => setOpen(true)} renderIcon={Download16}>Export whole library</Button>

                        }>

                            {(modalProps) => <ExportLibraryModal {...modalProps} />}
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