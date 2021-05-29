import average2Values from './average2Values/index.js'

const computations = [
    average2Values
]

const initDefinitions = () => computations.map(computation => computation.definition)


const moduleExports = {
    initDefinitions,
    ...computations
}

export default moduleExports