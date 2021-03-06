import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import toast from 'react-hot-toast'
import Papa from 'papaparse'
import { ToastNotification } from 'carbon-components-react'

export const getPkNameOfLibrary = (library: Library) => {
  const field = library.fields.find(field => field.primaryKey)

  if (field) return field.name
  return
}

export const getDateString = () => {

  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hour = `${date.getHours()}`.padStart(2, '0')
  const minute = `${date.getMinutes()}`.padStart(2, '0')
  return `${year}${month}${day}-${hour}${minute}`

}

export const saveAsCSV = (data: { [key: string]: any }[], filename: string) => {

  const csv = Papa.unparse(data)

  const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

  const csvURL = window.URL.createObjectURL(csvData);

  const tempLink = document.createElement('a')
  tempLink.href = csvURL;
  tempLink.setAttribute('download', filename);
  tempLink.click();
}

type request = { url: string, params?: { [key: string]: any } }

const callAPI = async (request: request) => {
  return await fetch('/api/v1/' + request.url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request.params ? request.params : {})
    })

}

export const useAPI = (request: request) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{ [key: string]: any } | undefined>(undefined)

  const callAPI = async (params?: { [key: string]: any }, setter?: (data: any) => void) => {
    if (params) request.params = params
    else request.params = {}

    setLoading(true)
    const response = await API(request)
    setData(response)
    setLoading(false)
    if (setter) setter(response)
    return response
  }

  return [callAPI, { loading, data }] as const

}

const API = async (request: request, setter?: (value: { [key: string]: any }) => void) => {
  const response = await callAPI(request)
  if (response.status === 200 && response.headers.get("content-type")) {
    const toJson = await response.json()
    if (setter) setter(toJson)
    return toJson
  } else if (response.status === 400 || response.status === 500) {
    const toJson = await response.json()
    toast((t) => (
      <span>
        <b>{toJson.title}</b>
        {toJson.message}
        <button onClick={() => toast.dismiss(t.id)}>
          Dismiss
        </button>
      </span>)
    )}

  else {
    console.log('unknown')
  }
  toast.error("An unknown error occured")
  return 
}


export const useFetch = (requests: request[], callback?: (data: { [url: string]: { [key: string]: any } }) => void) => {

  const history = useHistory()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{ [url: string]: { [key: string]: any } }>({})

  useEffect(() => {
    if (!requests) return

    const fetchData = async () => {
      setLoading(true)

      for (const request of requests) {

        const response = await callAPI(request)

        if (response.status === 401) {
          history.push('/login')
          setLoading(false)
          return
        } else if ((response.status === 400 || response.status == 500) && response.headers.get("content-type")) { 

          const {title, detail, type} = await response.json()


          toast((t) => (<ToastNotification style={{margin: 0}} onCloseButtonClick={() => toast.dismiss(t.id)} kind={type} title={title} subtitle={detail}/>), {duration: 10000})
          
        }
        else if (response.headers.get('content-type')) {

          data[request.url] = await response.json()

        }
      }
      setData(data)
      if (callback) callback(data)
      setLoading(false)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return { loading, data }
}



export const slugify = (string: string) => {
  const a = '?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    // eslint-disable-next-line
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    // eslint-disable-next-line
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

export const useForceUpdate = () => {
  // eslint-disable-next-line
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

export const randId = () => {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}
