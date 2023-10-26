import { ReactNode, createContext, useState } from 'react'
import { UserDTO, UserSignUpDTO } from '@dtos/UserDTO'
import { api } from '@services/api'

import * as ImagePicker from 'expo-image-picker'
import {
  storageUserAndTokenRemove,
  storageUserSave,
} from '@storage/storageUser'
import { storageAuthTokenSave } from '@storage/storageAuthToken'
import { storageProductAndImageRemove } from '@storage/storageProducts'

export type AuthContextDataProps = {
  user: UserDTO
  signIn: (email: string, password: string) => void
  signUp: (
    userRequest: UserSignUpDTO,
    image: ImagePicker.ImagePickerAsset,
  ) => void
  signOut: () => void
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`

    setUser(userData)
  }

  async function storageUserAndTokenSave(
    userData: UserDTO,
    token: string,
    refresh_token: string,
  ) {
    try {
      await storageUserSave(userData)
      await storageAuthTokenSave(token, refresh_token)
    } catch (error) {
      throw error
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password })

      if (data.user && data.token && data.refresh_token) {
        await storageUserAndTokenSave(data.user, data.token, data.refresh_token)
        userAndTokenUpdate(data.user, data.token)
      }

      setUser(data.user)
    } catch (error) {
      throw error
    }
  }

  async function signUp(
    userRequest: UserSignUpDTO,
    image: ImagePicker.ImagePickerAsset,
  ) {
    try {
      const fileExtension = image.uri.split('.').pop()
      const photoFile = {
        name: `${userRequest.name}.${fileExtension}`.toLowerCase(),
        uri: image.uri,
        type: `${image.type}/${fileExtension}`,
      } as any

      const formData = new FormData()
      formData.append('avatar', photoFile)
      formData.append('name', userRequest.name)
      formData.append('email', userRequest.email)
      formData.append('tel', userRequest.phone)
      formData.append('password', userRequest.password)

      await api.post('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      await signIn(userRequest.email, userRequest.password)
    } catch (error) {
      throw error
    }
  }

  async function signOut() {
    try {
      await storageProductAndImageRemove()
      await storageUserAndTokenRemove()
      setUser({} as UserDTO)
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
