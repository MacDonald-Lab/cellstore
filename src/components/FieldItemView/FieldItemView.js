import {Tag} from 'carbon-components-react'


const FieldItemView = ({ field, value }) => {
  const type = field.dataType
  if (type === 'int' || type === 'string') return <>{value}</>
  else if (type === 'multiselect') {

    var newValue = 'Unknown Value'
    var color = 'red'

    if (field.multiselectStoredAs === 'int') {
      const option = field.multiselectOptions.find(options => options.storedAs === value)
      newValue = option['friendlyName']
      color = option['color']
    }
    
    console.log(color)
    if (field.multiselectTags) return <Tag type={color}>{newValue}</Tag>
    else return <>{newValue}</>

  }
  return <>Unknown Type</>

}

export default FieldItemView