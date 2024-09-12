// ** React Imports
import { createContext, ReactNode, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { httpService } from 'src/configs/http-service'
import { AuthValuesType, ErrCallbackType, LoginParams, RegisterParams, UserDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      const userData = window.localStorage.getItem('userData')
      if (storedToken && userData) {
        setLoading(false)
        setUser(JSON.parse(userData))
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    const postData = new FormData()
    Object.entries(params).map(([key, value]) => postData.append(key.toString(), value as string))

    httpService
      .post(authConfig.loginEndpoint, postData)
      .then(async response => {
        const { data } = response

        window.localStorage.setItem(authConfig.storageTokenKeyName, data.Authorization)
        const returnUrl = router.query.returnUrl

        const userData = {
          id: 1,
          role: data.roles[0] == 'OperationsDirector' ? 'admin' : 'client',
          fullName: 'Sety',
          username: 'sety',
          email: 'admin@vuexy.com',
          password: '123'
        }

        setUser(userData)
        window.localStorage.setItem('userData', JSON.stringify(userData))

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        // {"id":1,"role":"admin","fullName":"John Doe","username":"johndoe","email":"admin@vuexy.com"}

        router.replace(redirectURL as string)
      })

      .catch(err => {
        console.log(err)
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          // handleLogin({ email: params.email, password: params.password })
        }
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
