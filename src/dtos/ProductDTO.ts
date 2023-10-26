export type payment_methods = 'pix' | 'card' | 'deposit' | 'cash' | 'boleto'

export type PaymentsMethodsType = {
  key: string
  name: string
}
export type ProductsImagesType = {
  id: string
  path: string
}

export type ProductDTO = {
  name: string
  description: string
  is_new: boolean
  accept_trade: boolean
  payment_methods: Array<payment_methods>
  price: number
}

export type GetAllProductsDTO = {
  id: string
  name: string
  description: string
  is_new: boolean
  accept_trade: boolean
  payment_methods: Array<payment_methods>
  price: number
  product_images: Array<ProductsImagesType>

  user: {
    avatar: string
  }
}

export type GetMyProductsDTO = {
  id: string
  name: string
  description: string
  is_new: boolean
  accept_trade: boolean
  payment_methods: Array<payment_methods>
  price: number
  is_active: boolean
  product_images: Array<ProductsImagesType>

  user: {
    avatar: string
  }
}
