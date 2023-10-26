import { DescriptionProduct } from '@components/DescriptionProduct'
import { ImagesProduct } from '@components/ImagesProduct'
import { InfoSeller } from '@components/InfoSeller'
import { PaymentsMethods } from '@components/PaymentsMethods'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import {
  Box,
  Center,
  HStack,
  Heading,
  Pressable,
  ScrollView,
  Text,
  useToast,
} from 'native-base'
import { ArrowLeft, Tag } from 'phosphor-react-native'
import { useCallback, useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ProductDTO } from '@dtos/ProductDTO'
import { Loading } from '@components/Loading'

import * as ImagePicker from 'expo-image-picker'
import { ProductsContext } from '../context/ProductsContext'
import { AppError } from '@utils/AppError'
import {
  storageProductGet,
  storageProductImagesGet,
} from '@storage/storageProducts'

export function ResumeProduct() {
  const [images, setImages] = useState<Array<ImagePicker.ImagePickerAsset>>([])
  const [imagesUri, setImagesUri] = useState<Array<string>>([])
  const [product, setProduct] = useState<ProductDTO>({} as ProductDTO)
  const [indexImage, setIndexImage] = useState(0)

  const { user } = useContext(AuthContext)
  const { newProduct } = useContext(ProductsContext)

  const navigation = useNavigation()
  const toast = useToast()

  function handleAlterImage(newIndex: number) {
    if (newIndex >= 0 && newIndex < images.length) {
      setIndexImage(newIndex)
    }
  }

  async function handleNewProduct() {
    try {
      await newProduct(product, images)
      navigation.navigate('home')
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

  async function getAdData() {
    try {
      const data = await storageProductGet()
      const images: Array<ImagePicker.ImagePickerAsset> =
        await storageProductImagesGet()

      const imagesUri = images.map((image) => image.uri)

      setImagesUri(imagesUri)
      setImages(images)
      setProduct(data)
    } catch (error) {
      toast.show({
        title: 'Falha ao acessar pré visualização do anúncio.',
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  useFocusEffect(
    useCallback(() => {
      getAdData()
    }, []),
  )

  if (!product.name) return <Loading />

  return (
    <>
      <ScrollView bgColor={'gray.600'}>
        <Center bgColor={'lightBlue.100'} pt={20} pb={4}>
          <Heading fontFamily={'heading'} color={'gray.700'} fontSize={'md'}>
            Pré visualização do anúncio
          </Heading>
          <Text fontFamily={'body'} color={'gray.700'} fontSize={'sm'}>
            É assim que seu produto vai aparecer!
          </Text>
        </Center>

        <ImagesProduct
          handleAlterImage={handleAlterImage}
          images={imagesUri}
          indexImage={indexImage}
        />

        <Box px={6} py={4}>
          <InfoSeller name={user.name} avatar={user.avatar} />
          <DescriptionProduct
            title={product.name}
            price={product.price}
            description={product.description}
            is_new={product.is_new}
            accept_trade={product.accept_trade}
          />
          <PaymentsMethods paymentsMethods={product.payment_methods} />
        </Box>
      </ScrollView>

      <HStack justifyContent={'space-between'} my={6} px={4}>
        <Pressable
          h={14}
          w={'48%'}
          flexDirection={'row'}
          bgColor={'gray.500'}
          justifyContent={'center'}
          alignItems={'center'}
          borderRadius={'md'}
          onPress={() => navigation.navigate('newProduct')}
        >
          <ArrowLeft size={22} />
          <Text
            color={'gray.200'}
            fontSize={'sm'}
            fontFamily={'heading'}
            ml={2}
          >
            Voltar e editar
          </Text>
        </Pressable>

        <Pressable
          h={14}
          w={'48%'}
          flexDirection={'row'}
          bgColor={'lightBlue.100'}
          justifyContent={'center'}
          alignItems={'center'}
          borderRadius={'md'}
          onPress={handleNewProduct}
        >
          <Tag size={22} color="#EDECEE" />
          <Text
            color={'gray.700'}
            fontSize={'sm'}
            fontFamily={'heading'}
            ml={2}
          >
            Publicar
          </Text>
        </Pressable>
      </HStack>
    </>
  )
}
