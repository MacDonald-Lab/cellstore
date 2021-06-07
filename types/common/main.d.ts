interface ComputationDefinition {

    name: string,
    friendlyName: string,
    description: string,

    inputs: {
       name: string,
       friendlyName: string,
       parameterName: string,
       description: string,
       dataTypes: ("int" | "float")[],
        required: boolean
    }[],

    outputs: {
        name: string,
        friendlyName: string,
        parameterName: string,
        description: string,
        dataType: "int" | "float"
    }[]
}

interface ComputationInput {
    [key: string]: any
}

interface ComputationOutput {
    [key: string]: any
}

interface Computation {
    definition: ComputationDefinition,
    function: (ComputationInput) => ComputationOutput
}
type TagColors = "red" | "magenta" | "purple" | "blue" | "cyan" | "teal" | "green" | "gray" | "cool-gray" | "warm-gray" | "high-contrast"

interface MultiselectOption {
    friendlyName: string,
    storedAs: int | string,
    color?: TagColors
}

type FieldDataTypes = "int" | "string" | "multiselect"

interface LibraryField {
    name: string,
    key: string,
    friendlyName: string,
    dataType: FieldDataTypes,
    restrictions?: string[],
    primaryKey: boolean,
    multiselectStoredAs?: "int" | "string",
    multiselectTags?: boolean,
    multiselectOptions?: MultiselectOption[]
}

interface Library {
    name: string,
    friendlyName: string,
    description: string,
    fields: LibraryField[],
    dataTypes: string[],
    viewingTableColumns: string[]

}