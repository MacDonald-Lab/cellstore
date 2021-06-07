import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
// import { createPortal } from 'react-dom'

// export const useDraggableInPortal = () => {
//   const self = useRef({}).current;

//   useEffect(() => {
//     const div = document.createElement('div');
//     div.style.position = 'absolute';
//     div.style.pointerEvents = 'none';
//     div.style.top = '0';
//     div.style.width = '100%';
//     div.style.height = '100%';
//     self.elt = div;
//     document.body.appendChild(div);
//     return () => {
//       document.body.removeChild(div);
//     };
//   }, [self]);

//   return (render: any) => (provided: any, ...args: any[]) => {
//     const element = render(provided, ...args);
//     if (provided.draggableProps.style.position === 'fixed') {
//       return createPortal(element, self.elt);
//     }
//     return element;
//   };
// };

type request = { url: string, params?: {[key: string]: any} }

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

export const API = async (request: request, setter?: (value: {[key: string]: any}) => void) => {
  const response = await callAPI(request)
  if (response.status === 200) {
    const toJson = await response.json()
    if (setter) setter(toJson)
  }
  else return
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
        } else {

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
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
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
