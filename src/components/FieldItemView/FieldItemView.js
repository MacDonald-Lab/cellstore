import {Tag} from 'carbon-components-react'


const FieldItemView = ({ field, cell }) => {
  const type = field.dataType
  if (type === 'int' || type === 'string') return <>{cell[field.name]}</>
  else if (type === 'multiselect') {

    var value = 'Unknown Value'
    var color = 'red'

    if (field.multiselectStoredAs === 'int') {
      const option = field.multiselectOptions.find(options => options.storedAs === cell[field.name])
      value = option['friendlyName']
      color = option['color']
    }
    
    console.log(color)
    if (field.multiselectTags) return <Tag type={color}>{value}</Tag>
    else return <>{value}</>

  }
  return <>Unknown Type</>

}

export default FieldItemView