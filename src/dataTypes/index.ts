import GeneExpression from './GeneExpression'

const types = [
    GeneExpression
]

const initDescriptions = () => types.map(type => type.initDescription())

const initViews = (libraryName: string, queryData: JSON) => {
    const views = []
    for (var type in types) {
        const view = types[type].initView(libraryName, queryData)
        if (view) views.push(view)
    }
    return views
}  

const moduleExports = {
    initViews,
    initDescriptions,

    GeneExpression
}

export default moduleExports