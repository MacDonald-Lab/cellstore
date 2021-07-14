import {initView} from './View.jsx'
import {initDescription} from './Description.js'
import {onAdd, onSubmit, onDatabaseImport} from './Import.js'
import getDatabaseDefinition from './Database.js'

const moduleExports = {
    initView,
    initDescription,
    getDatabaseDefinition,
    onAdd,
    onSubmit,
    onDatabaseImport
}

export default moduleExports