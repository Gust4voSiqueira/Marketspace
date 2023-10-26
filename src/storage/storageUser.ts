import { UserDTO } from '@dtos/UserDTO'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AUTH_TOKEN_STORAGE, USER_STORAGE } from './storageConfig'

export async function storageUserSave(user: UserDTO) {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
}

export async function storageUserGet() {
  const storage = await AsyncStorage.getItem(USER_STORAGE)

  const user: UserDTO = storage ? JSON.parse(storage) : {}

  return user
}

export async function storageUserAndTokenRemove() {
  await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE)
  await AsyncStorage.removeItem(USER_STORAGE)
}
