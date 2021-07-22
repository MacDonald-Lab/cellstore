const definition = {
    name: "average-2-values",
    friendlyName: "Average 2 Values",
    description: "Determine the mean (average) of 2 values in 2 columns",
    group: false,

    inputs: [
        {
            name: "value-a",
            friendlyName: "Value A",
            parameterName: "valueA",
            description: "The first value",
            dataTypes: ["int", "float"],
            required: true
        },
        {
            name: "value-b",
            friendlyName: "Value B",
            parameterName: "valueB",
            description: "The second value",
            dataTypes: ["int", "float"],
            required: true
        },
    ],

    outputs: [
        {
            name: "average",
            friendlyName: "Average",
            parameterName: "average",
            description: "The mean of value A and B",
            dataType: "float"
        }
    ]
}

const averageValue = ({ valueA, valueB }) => {
    return { average: (parseFloat(valueA) + parseFloat(valueB)) / 2 }
}

const exportObject = {
    definition: definition,
    function: averageValue
}

export default exportObject