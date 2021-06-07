import average2Values from './average2Values'

const computations: Computation[] = [
    average2Values
]

const initDefinitions = () => computations.map(computation => computation.definition)

const initDefinition = (name: string) => computations.find(computation => computation.definition.name === name)

// @ts-ignore
const run = (name: string, params: {[key: string]: any}) => computations.find(computation => computation.definition.name === name).function(params)

const moduleExports = {
    initDefinitions,
    initDefinition,
    run,
    ...computations
}

export default moduleExports