import average2Values from './average2Values'

const computations = [
    average2Values
]

const initDefinitions = () => computations.map(computation => computation.definition)

const initDefinition = (name) => computations.find(computation => computation.definition.name === name)

const run = (name, params) => computations.find(computation => computation.definition.name === name).function(params)

const moduleExports = {
    initDefinitions,
    initDefinition,
    run,
    ...computations
}

export default moduleExports