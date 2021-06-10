// import seq from 'sequelize'

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

const getDatabaseDefinition = (typeName: string) => {
    const type = types.find(value => value.initDescription().id = typeName)
    if (!type) return
    return type.getDatabaseDefinition
}

const moduleExports = {
    initViews,
    initDescriptions,
    getDatabaseDefinition,

    GeneExpression
}

export default moduleExports