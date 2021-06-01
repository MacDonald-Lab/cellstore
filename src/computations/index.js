import average2Values from './average2Values/index.js'

const computations = [
    average2Values
]

const initDefinitions = () => computations.map(computation => computation.definition)

const initDefinition = (name) => computations.find(computation => computation.name === name)


const moduleExports = {
    initDefinitions,
    initDefinition,
    ...computations
}

export default moduleExports