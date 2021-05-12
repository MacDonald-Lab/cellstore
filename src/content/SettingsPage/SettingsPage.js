import { Download16 } from '@carbon/icons-react';
import { Accordion, AccordionItem, Button, Column, Grid, Row, StructuredListBody, StructuredListCell, StructuredListRow, StructuredListWrapper } from 'carbon-components-react';
import { React } from 'react';
import ExportLibraryModal from '../../components/ExportLibraryModal';
import ModalStateManager from '../../components/ModalStateManager';


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
                <AccordionItem title="Libraries">
                    Library settings

                    <ModalStateManager renderLauncher={({ setOpen}) => 
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