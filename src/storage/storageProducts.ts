import { ProductDTO } from '@dtos/ProductDTO'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import { PRODUCT_IMAGES_STORAGE, PRODUCT_STORAGE } from './storageConfig'

export async function storageProductSave(
  product: ProductDTO,
  images: Array<ImagePicker.ImagePickerAsset>,
) {
  await AsyncStorage.setItem(PRODUCT_STORAGE, JSON.stringify(product))
  await AsyncStorage.setItem(PRODUCT_IMAGES_STORAGE, JSON.stringify(images))
}

export async function storageProductGet() {
  const response = await AsyncStorage.getItem(PRODUCT_STORAGE)

  return response ? JSON.parse(response) : {}
}

export async function storageProductImagesGet() {
  const response = await AsyncStorage.getItem(PRODUCT_IMAGES_STORAGE)

  return response ? JSON.parse(response) : {}
}

export async function storageProductAndImageRemove() {
  await AsyncStorage.removeItem(PRODUCT_STORAGE)
  await AsyncStorage.removeItem(PRODUCT_IMAGES_STORAGE)
}
