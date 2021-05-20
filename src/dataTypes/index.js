import GeneExpression from './GeneExpression'

const types = [
    GeneExpression
]


const initViews = (libraryName, queryData) => {
    const views = []
    for (var type in types) {
        const view = types[type].initView(libraryName, queryData)
        if (view) views.push(view)
    }
    return views
}  

export default {
    initViews
}