import { React } from 'react';
import { Tag } from 'carbon-components-react';
import { SimpleBarChart } from '@carbon/charts-react';
import PageSection from '../../components/PageSection/PageSection';


export const initView = (libraryName, queryData) => {

    const parsedQuery = queryData['rawDnaByJoanCellId'][`${libraryName}GeneExpressionByForeignId`]
    const chartOptions = {
        "title": "Common Gene Expressions",
        "axes": {
            "left": {
                "mapsTo": "group",
                "scaleType": "labels"
            },
            "bottom": {
                "mapsTo": "value"
            }
        },
        "height": "450px"
    }
    if (parsedQuery) {

        const arrayGenes = Object.keys(parsedQuery.expression).map(key =>
        ({
            "group": key,
            "value": parseInt(parsedQuery.expression[key])
        })).sort((a, b) => b.value - a.value) // Sorted in descending order of count

        const smallArrayGenes = arrayGenes.slice(0, 9)
        const medArrayGenes = arrayGenes.slice(0, 101)

        return {
            id: 'GeneExpression',
            friendlyName: 'Gene expression',
            component: () => <div>

                {smallArrayGenes &&
                    <SimpleBarChart data={smallArrayGenes} options={chartOptions} />
                }


                {medArrayGenes && <div>
                    <PageSection title="Top 100 Genes" description="Sorted by count" />
                    {medArrayGenes.map(item => <Tag>{item.group} <strong>{item.value}</strong></Tag>)}
                </div>}

            </div>
        }
    }

    return null

}