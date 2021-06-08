import { createContext, useState, useEffect } from "react";
import {useHistory} from "react-router-dom"
const context = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const history = useHistory()

  useEffect(() => {

    const fetchData = async () => {

         const response = await fetch("/api/auth/user")
         
         if (response.status === 401) {
             return history.push('/login')
         } else {
             const toJson = await response.json()
             setUser(toJson)
         }
    }

    fetchData()
  }, []);

  return (
      <context.Provider value={user}>
          {children}
      </context.Provider>
  );
};

UserProvider.context = context;

export default UserProvider;