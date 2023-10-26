import { useCallback, useContext, useState } from 'react'
import {
  ArrowLeft,
  PencilSimpleLine,
  Power,
  TrashSimple,
} from 'phosphor-react-native'
import {
  Box,
  HStack,
  Pressable,
  ScrollView,
  Text,
  VStack,
  useToast,
} from 'native-base'

import { DescriptionProduct } from '@components/DescriptionProduct'
import { ImagesProduct } from '@components/ImagesProduct'
import { InfoSeller } from '@components/InfoSeller'
import { PaymentsMethods } from '@components/PaymentsMethods'
import {
  GetMyProductsDTO,
  PaymentsMethodsType,
  ProductsImagesType,
} from '@dtos/ProductDTO'
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { Loading } from '@components/Loading'
import { UserDTO } from '@dtos/UserDTO'
import { ProductsContext } from '../context/ProductsContext'
import { Alert } from 'react-native'

type DetailsMyProductProps = {
  idProduct: string
}

export function DetailsMyProduct() {
  const [product, setProduct] = useState<GetMyProductsDTO>(
    {} as GetMyProductsDTO,
  )
  const [images, setImages] = useState<string[]>([])
  const [indexImage, setIndexImage] = useState(0)
  const [user, setUser] = useState({} as UserDTO)
  const [isLoading, setIsLoading] = useState(true)

  const { editActiveProduct, removeProduct, addProductToEdit } =
    useContext(ProductsContext)

  const routes = useRoute()
  const toast = useToast()
  const navigate = useNavigation()

  async function fetchData() {
    try {
      setIsLoading(true)
      const { data } = await api.get(`/products/${idProduct}`)

      const payment_methods = data.payment_methods.map(
        (method: PaymentsMethodsType) => method.key,
      )

      const images_products = data.product_images.map(
        (image: ProductsImagesType) =>
          `${api.defaults.baseURL}/images/${image.path}`,
      )

      setUser(data.user)
      setImages(images_products)

      setProduct({ ...data, payment_methods })
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Não foi possível criar a conta. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleAlterImage(newIndex: number) {
    if (newIndex >= 0 && newIndex < images.length) {
      setIndexImage(newIndex)
    }
  }

  async function editIsActiveProduct() {
    try {
      setIsLoading(true)
      await editActiveProduct(idProduct, !product.is_active)
      await fetchData()
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Não foi possível editar o anúncio. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteProduct() {
    try {
      Alert.alert(
        'Remover anúncio',
        'Tem certeza que deseja remover este anúncio?',
        [
          {
            text: 'cancelar',
            style: 'cancel',
          },
          {
            text: 'sim, remover',
            style: 'destructive',
            onPress: () => {
              removeProduct(idProduct)
              navigate.navigate('myProducts')
            },
          },
        ],
      )
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Não foi possível remover o anúncio. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  async function editProduct() {
    try {
      addProductToEdit(product)
      navigate.navigate('editProduct')
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Não foi possível editar o anúncio. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, []),
  )

  const { idProduct } = routes.params as DetailsMyProductProps

  if (isLoading) return <Loading />

  return (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <HStack pt={12} pb={4} justifyContent={'space-between'}>
        <Pressable ml={6} onPress={() => navigate.goBack()}>
          <ArrowLeft size={24} color="#1A181B" />
        </Pressable>

        <Pressable mr={6} onPress={editProduct}>
          <PencilSimpleLine size={24} color="#1A181B" />
        </Pressable>
      </HStack>
      <ImagesProduct
        handleAlterImage={handleAlterImage}
        images={images}
        indexImage={indexImage}
        isActive={product.is_active}
      />

      <Box paddingX={6} py={4} bgColor={'gray.600'}>
        <InfoSeller name={user.name} avatar={user.avatar} />
        <DescriptionProduct
          title={product.name}
          description={product.description}
          is_new={product.is_new}
          price={product.price}
          accept_trade={product.accept_trade}
        />
        <PaymentsMethods paymentsMethods={product.payment_methods} />
      </Box>

      <VStack
        flex={1}
        justifyContent={'center'}
        alignItems={'center'}
        px={4}
        mb={8}
      >
        <Pressable
          h={14}
          w={'100%'}
          flexDirection={'row'}
          bgColor={product.is_active ? 'gray.100' : 'lightBlue.100'}
          justifyContent={'center'}
          alignItems={'center'}
          borderRadius={'md'}
          mb={2}
          onPress={editIsActiveProduct}
        >
          <Power size={22} color="#EDECEE" />
          <Text
            color={'gray.700'}
            fontSize={'sm'}
            fontFamily={'heading'}
            ml={2}
          >
            {product.is_active ? 'Desativar anúncio' : 'Reativar anúncio'}
          </Text>
        </Pressable>

        <Pressable
          h={14}
          w={'100%'}
          flexDirection={'row'}
          bgColor={'gray.500'}
          justifyContent={'center'}
          alignItems={'center'}
          borderRadius={'md'}
          onPress={deleteProduct}
        >
          <TrashSimple size={22} color="#5F5B62" />
          <Text
            color={'gray.200'}
            fontSize={'sm'}
            fontFamily={'heading'}
            ml={2}
          >
            Excluir anúncio
          </Text>
        </Pressable>
      </VStack>
    </ScrollView>
  )
}
