import { useFocusEffect, useRoute } from '@react-navigation/native'
import {
  Box,
  HStack,
  Heading,
  Pressable,
  ScrollView,
  Text,
  useToast,
} from 'native-base'
import { useCallback, useState } from 'react'
import { PaymentsMethods } from '../components/PaymentsMethods'
import { DescriptionProduct } from '../components/DescriptionProduct'
import { ImagesProduct } from '../components/ImagesProduct'
import { InfoSeller } from '../components/InfoSeller'
import { AppError } from '@utils/AppError'
import { api } from '@services/api'
import {
  GetAllProductsDTO,
  PaymentsMethodsType,
  ProductsImagesType,
} from '@dtos/ProductDTO'
import { Loading } from '@components/Loading'
import { UserDTO } from '@dtos/UserDTO'
import { formatPrice } from '@utils/FormatPrice'
import { WhatsappLogo } from 'phosphor-react-native'
import { Alert, Linking } from 'react-native'

interface IOpenURLButton {
  url: string
  children: React.ReactNode
}

const OpenURLButton = ({ url, children }: IOpenURLButton) => {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url)

    if (supported) {
      await Linking.openURL(url)
    } else {
      Alert.alert(
        'Tivemos um problema ao entrar em contato com o vendedor. Tente novamente mais tarde.',
      )
    }
  }, [url])

  return <Pressable onPress={handlePress}>{children}</Pressable>
}

interface IDetailsParams {
  idProduct: string
}

export function DetailsProduct() {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [product, setProduct] = useState<GetAllProductsDTO>(
    {} as GetAllProductsDTO,
  )
  const [images, setImages] = useState<string[]>([])
  const [indexImage, setIndexImage] = useState(0)

  const route = useRoute()
  const toast = useToast()

  const { idProduct } = route.params as IDetailsParams

  async function fetchDetailsProduct() {
    try {
      const { data } = await api.get(`/products/${idProduct}`)

      const payment_methods = data.payment_methods.map(
        (method: PaymentsMethodsType) => method.key,
      )
      const product_images = data.product_images.map(
        (method: ProductsImagesType) =>
          `${api.defaults.baseURL}/images/${method.path}`,
      )

      setUser(data.user)
      setImages(product_images)

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
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchDetailsProduct()
    }, []),
  )

  function handleAlterImage(newIndex: number) {
    if (newIndex >= 0 && newIndex < images.length) {
      setIndexImage(newIndex)
    }
  }

  if (!product.name) return <Loading />

  return (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <ImagesProduct
        handleAlterImage={handleAlterImage}
        images={images}
        indexImage={indexImage}
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

      <HStack
        justifyContent={'space-between'}
        alignItems={'flex-end'}
        bgColor={'gray.700'}
        p={6}
      >
        <Heading
          fontFamily={'heading'}
          color={'blue'}
          fontSize={'sm'}
          bgColor={'black'}
          pt={2}
        >
          R${' '}
          <Heading fontFamily={'heading'} color={'blue'} fontSize={'xl'}>
            {formatPrice(product.price)}
          </Heading>
        </Heading>

        <Box
          flexDir={'row'}
          justifyContent={'center'}
          borderRadius={'md'}
          bgColor={'lightBlue.100'}
          w={'50%'}
          p={3}
        >
          <OpenURLButton url={`https://wa.me/${user.tel}`}>
            <HStack alignItems={'center'}>
              <WhatsappLogo size={16} weight="fill" color="#EDECEE" />
              <Text
                fontFamily={'heading'}
                color={'gray.700'}
                fontSize={'sm'}
                ml={2}
              >
                Entrar em contato
              </Text>
            </HStack>
          </OpenURLButton>
        </Box>
      </HStack>
    </ScrollView>
  )
}
