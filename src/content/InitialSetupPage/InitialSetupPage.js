import { useState } from 'react'

import { Grid, Row, Column, TextInput, Button } from 'carbon-components-react'
import { useAPI } from '../../components/Hooks.tsx'

const InitialSetupPage = () => {
    const [settings, setSettings] = useState({
        organizationName: ""
    })

    const [pushSettings] = useAPI({ url: 'setSettings' })

    return <Grid>
        <Row>
            <Column>

                <h1>Welcome to CellSTORE!</h1>
                <h3>Let's get started</h3>

            </Column>
        </Row>
        <Row>
            <Column>
                {Object.keys(settings).map((item, i) =>
                    <TextInput key={item} id={item} value={settings[item]} labelText={item} onChange={(e) => {
                        const tempSettings = { ...settings }
                        tempSettings[item] = e.target.value
                        setSettings(tempSettings)
                    }} />
                )}

                <Button onClick={async () => {
                    await pushSettings({ payload: settings })
                    window.location.reload()

                }}>Submit</Button>

            </Column>
        </Row>


    </Grid>

}

export default InitialSetupPage