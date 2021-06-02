
const API_URL = 'http://localhost:5001/'

// default get/set

const getFromAPIFunc = (request) => {

    const getCall = async (setter = null, parameters = {}, loading = null, callback = null) => {
        const response = await fetch(`${API_URL}${request}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(parameters)
            })

        if (setter && response.status !== 404 && response.status !== 520) {

            const parsedResponse = await response.json()
            setter(parsedResponse)
            if (callback) callback(parsedResponse)

        }
        if (loading) loading(false)
        return response
    }
    return getCall

}

const GET_REQUESTS = [
    'getSettings',
    'setSettings',
    'getLibraries',
    'getLibrary',
    'getLibraryData',
    'getCell',
    'createLibrary',
    'addItemToLibrary',
    'getFilteredCells',
    'getComputations',
    'getComputation',
    'runComputation',
    'runComputationOnLibrary',
    'deleteLibrary',
    'deleteCell',
    // TO IMPLEMENT
    // 'deleteCells',
    // 'editCell',
    // 'editLibrary',
    // 'runComputationOnCell',
    // 'runComputationOnCells'
]

var calls = {}

for (const key of GET_REQUESTS) {
    calls[key] = getFromAPIFunc(key)
}

export default calls