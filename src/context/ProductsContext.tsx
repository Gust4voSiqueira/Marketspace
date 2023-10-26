import { ReactNode, createContext, useContext, useState } from 'react'
import { GetMyProductsDTO, ProductDTO, payment_methods } from '@dtos/ProductDTO'
import { api } from '@services/api'

import * as ImagePicker from 'expo-image-picker'
import { AuthContext } from './AuthContext'
import {
  storageProductAndImageRemove,
  storageProductSave,
} from '@storage/storageProducts'
import { formatPriceToRegister } from '@utils/FormatPrice'

export interface NewProductRequest {
  name: string
  description: string
  is_new: string
  accept_trade: boolean
  payment_methods: Array<payment_methods>
  price: string
}

type ProductsContextDataProps = {
  productToEdit: GetMyProductsDTO
  addProductToEdit: (product: GetMyProductsDTO) => void
  newProduct: (
    productRequest: ProductDTO,
    images: Array<ImagePicker.ImagePickerAsset>,
  ) => void
  saveProductStorage: (
    productRequest: NewProductRequest,
    images: Array<ImagePicker.ImagePickerAsset>,
  ) => void
  editActiveProduct: (idProduct: string, isNewActive: boolean) => void
  removeProduct: (idProduct: string) => void
  editProduct: (
    productUpdated: ProductDTO,
    productId: string,
    imagesDeleted: string[],
    newImages: ImagePicker.ImagePickerAsset[],
  ) => void
}

type ProductsContextProviderProps = {
  children: ReactNode
}

export const ProductsContext = createContext<ProductsContextDataProps>(
  {} as ProductsContextDataProps,
)

export function ProductsContextProvider({
  children,
}: ProductsContextProviderProps) {
  const [productToEdit, setProductToEdit] = useState<GetMyProductsDTO>(
    {} as GetMyProductsDTO,
  )
  const { user } = useContext(AuthContext)

  async function newImage(
    images: Array<ImagePicker.ImagePickerAsset>,
    idProduct: string,
  ) {
    try {
      const imagesRequest = images.map((image) => {
        const fileExtension = image.uri.split('.').pop()

        return {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: image.uri,
          type: `${image.type}/${fileExtension}`,
        } as any
      })

      const productImagesUploadForm = new FormData()
      productImagesUploadForm.append('images', imagesRequest[0])
      productImagesUploadForm.append('images', imagesRequest[1])
      productImagesUploadForm.append('images', imagesRequest[2])
      productImagesUploadForm.append('product_id', idProduct)

      await api.post('/products/images', productImagesUploadForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    } catch (error) {
      throw error
    }
  }

  async function newProduct(
    productRequest: ProductDTO,
    images: Array<ImagePicker.ImagePickerAsset>,
  ) {
    try {
      const { data } = await api.post('/products', productRequest)
      await newImage(images, data.id)
      await storageProductAndImageRemove()
    } catch (error) {
      throw error
    }
  }

  async function saveProductStorage(
    product: NewProductRequest,
    images: Array<ImagePicker.ImagePickerAsset>,
  ) {
    try {
      const newProductRequest: ProductDTO = {
        ...product,
        is_new: product.is_new !== 'usage',
        price: formatPriceToRegister(product.price),
      }

      await storageProductSave(newProductRequest, images)
    } catch (error) {
      throw error
    }
  }

  async function editActiveProduct(idProduct: string, isNewActive: boolean) {
    try {
      await api.patch(`/products/${idProduct}`, {
        is_active: isNewActive,
      })
    } catch (error) {
      throw error
    }
  }

  async function removeProduct(idProduct: string) {
    try {
      await api.delete(`/products/${idProduct}`)
    } catch (error) {
      throw error
    }
  }

  function addProductToEdit(product: GetMyProductsDTO) {
    setProductToEdit(product)
  }

  async function editProduct(
    productUpdated: ProductDTO,
    productId: string,
    imagesDeleted: string[],
    newImages: ImagePicker.ImagePickerAsset[],
  ) {
    try {
      await api.put(`/products/${productId}`, productUpdated)

      if (imagesDeleted.length > 0) {
        await api.delete('/products/images', {
          data: { productImagesIds: imagesDeleted },
        })
      }

      if (newImages.length > 0) {
        await newImage(newImages, productId)
      }
    } catch (error) {
      throw error
    }
  }

  return (
    <ProductsContext.Provider
      value={{
        productToEdit,
        addProductToEdit,
        newProduct,
        saveProductStorage,
        editActiveProduct,
        removeProduct,
        editProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}
