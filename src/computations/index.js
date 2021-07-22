import average2Values from './average2Values/index.js'
import dispersion from './dispersion/index.js'

const computations = [
    average2Values,
    dispersion
]

const getComputation = (name) => computations.find(computation => computation.definition.name === name)


const initDefinitions = () => computations.map(computation => computation.definition)

const initDefinition = (name) => computations.find(computation => computation.definition.name === name)

// @ts-ignore
const run = (name, params) => computations.find(computation => computation.definition.name === name).function(params)

const runGroup = (name, paramList) => {

    const comp = getComputation(name)

    // TODO return as a single object for predicatability

    if (comp.definition.group) {
        return comp.function(paramList)
    }

    else {
        return paramList.map(param => ({id: param.id, ...comp.function(param)}))
    }

}

export {
    initDefinitions,
    initDefinition,
    getComputation,
    run,
    runGroup
}