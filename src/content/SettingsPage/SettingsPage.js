import { Accordion, AccordionItem, Column, Grid, Row, StructuredListBody, StructuredListCell, StructuredListRow, StructuredListWrapper } from 'carbon-components-react';
import { React } from 'react';


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