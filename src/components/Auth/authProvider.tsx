import
axios from 'axios'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

const AuthContext = createContext({} as any)

const AuthProvider = ({ children }: any) => {
  const [token, setToken_] = useState(localStorage.getItem('token'))

  const setToken = (newToken: string) => {
    setToken_(newToken)
  }

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.authorization = 'Bearer ' + token
      localStorage.setItem('token', token)
    } else {
      delete axios.defaults.headers.common.authorization
      localStorage.removeItem('token')
    }
  }, [token])

  const contextValue = useMemo(
    () => ({
      token,
      setToken
    }),
    [token]
  )

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export default AuthProvider
