/* eslint-disable react/no-children-prop */
import { useContext, useState } from 'react'

import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { NewProductRequest, ProductsContext } from '../context/ProductsContext'
import {
  Text,
  Heading,
  Switch,
  ScrollView,
  HStack,
  Image,
  Box,
  Pressable,
  useToast,
} from 'native-base'

import * as ImagePicker from 'expo-image-picker'
import { formatPrice, formatPriceToRegister } from '@utils/FormatPrice'

import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { Loading } from '@components/Loading'
import { DescriptionTextArea } from '@components/DescriptionTextArea'
import { ImagesInput } from '@components/ImagesInput'
import { IsNewRadio } from '@components/IsNewRadio'
import { PaymentsMethodsCheckbox } from '@components/PaymentsMethodsCheckbox'
import { api } from '@services/api'
import { X } from 'phosphor-react-native'
import { ProductDTO, ProductsImagesType } from '@dtos/ProductDTO'
import { AppError } from '@utils/AppError'
import { useNavigation } from '@react-navigation/native'

const editProductSchema = yup.object({
  name: yup.string().required('Informe o nome do produto.'),
  description: yup.string().required('Informe a descrição do produto.'),
  is_new: yup.string().required('Informe se o produto é novo ou usado.'),
  accept_trade: yup.boolean().default(false),
  payment_methods: yup
    .array()
    .required('Informe quais serão as formas de pagamento aceitas.'),
  price: yup.string().required('Informe o preço do produto.'),
})

export function EditProduct() {
  const { productToEdit, editProduct } = useContext(ProductsContext)
  const [newImages, setNewImages] = useState<ImagePicker.ImagePickerAsset[]>([])
  const [imagesDeletedIds, setImagesDeletedIds] = useState<string[]>([])
  const [oldImages, setOldImages] = useState<ProductsImagesType[]>(
    productToEdit.product_images,
  )
  const [loading, setLoading] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewProductRequest>({
    resolver: yupResolver(editProductSchema),
  })

  const toast = useToast()
  const navigation = useNavigation()

  function handleAddImage(image: ImagePicker.ImagePickerAsset) {
    setNewImages([...newImages, image])
  }

  function handleRemoveNewImage(imageRemoved: ImagePicker.ImagePickerAsset) {
    const imagesFiltered = newImages.filter((image) => image !== imageRemoved)
    setNewImages(imagesFiltered)
  }

  function handleRemoveOldImage(imageRemoved: ProductsImagesType) {
    const imagesFiltered = oldImages.filter((image) => image !== imageRemoved)

    setImagesDeletedIds([...imagesDeletedIds, imageRemoved.id])
    setOldImages(imagesFiltered)
  }

  async function handleEditProduct(data: NewProductRequest) {
    try {
      setLoading(true)
      if (newImages.length === 0 && oldImages.length === 0) {
        throw new AppError('Selecione a imagem do produto.')
      }

      const productRequest: ProductDTO = {
        ...data,
        is_new: data.is_new !== 'usage',
        price: formatPriceToRegister(data.price),
      }

      await editProduct(
        productRequest,
        productToEdit.id,
        imagesDeletedIds,
        newImages,
      )
      navigation.navigate('myProducts')
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Não foi possível editar o produto. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />

  return (
    <ScrollView flex={1} bgColor={'gray.600'} px={6} pt={6}>
      <Text fontSize={'md'} color={'gray.200'} fontFamily={'heading'}>
        Imagens
      </Text>

      <Text fontSize={'sm'} color={'gray.300'} fontFamily={'body'} mb={2}>
        Escolha até 3 imagens para mostrar o quanto seu produto é incrível!
      </Text>

      <ImagesInput
        quantitieImagesSelected={newImages.length + oldImages.length}
        handleAddImage={handleAddImage}
      >
        {oldImages.map((image) => (
          <Box key={image.path} position={'relative'} w={100} h={100} mr={2}>
            <Image
              source={{
                uri: `${api.defaults.baseURL}/images/${image.path}`,
              }}
              flex={1}
              borderRadius={'md'}
              alt=""
            />

            <Pressable
              position={'absolute'}
              borderRadius={'full'}
              bgColor={'gray.200'}
              justifyContent={'center'}
              alignItems={'center'}
              w={4}
              h={4}
              right={1}
              top={1}
              onPress={() => handleRemoveOldImage(image)}
            >
              <X color="#F7F7F8" size={14} />
            </Pressable>
          </Box>
        ))}

        {newImages.map((image) => (
          <Box key={image.base64} position={'relative'} w={100} h={100} mr={2}>
            <Image
              source={{
                uri: image.uri,
              }}
              flex={1}
              borderRadius={'md'}
              alt=""
            />

            <Pressable
              position={'absolute'}
              borderRadius={'full'}
              bgColor={'gray.200'}
              justifyContent={'center'}
              alignItems={'center'}
              w={4}
              h={4}
              right={1}
              top={1}
              onPress={() => handleRemoveNewImage(image)}
            >
              <X color="#F7F7F8" size={14} />
            </Pressable>
          </Box>
        ))}
      </ImagesInput>

      <Text fontSize={'md'} color={'gray.200'} fontFamily={'heading'} mb={2}>
        Sobre o produto
      </Text>

      <Controller
        control={control}
        defaultValue={productToEdit.name}
        name="name"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Título do anúncio"
            onChangeText={onChange}
            value={value}
            isError={!!errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        defaultValue={productToEdit.description}
        render={({ field: { onChange, value } }) => (
          <DescriptionTextArea
            value={value}
            isError={!!errors.description?.message}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="is_new"
        defaultValue={productToEdit.is_new ? 'new' : 'usage'}
        render={({ field: { onChange } }) => (
          <IsNewRadio
            name="new"
            onChange={onChange}
            defaultValue={productToEdit.is_new ? 'new' : 'usage'}
          />
        )}
      />

      <Heading
        fontSize={'md'}
        fontFamily={'heading'}
        color={'gray.200'}
        mb={2}
        mt={8}
      >
        Venda
      </Heading>

      <Controller
        control={control}
        name="price"
        defaultValue={
          productToEdit.price > 0
            ? `R$ ${formatPrice(productToEdit.price)}`
            : 'R$ '
        }
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Valor do produto"
            onChangeText={onChange}
            value={value}
            defaultValue={
              productToEdit.price > 0
                ? `R$ ${formatPrice(productToEdit.price)}`
                : 'R$ '
            }
            isError={!!errors.price?.message}
            keyboardType="numeric"
          />
        )}
      />

      <Text fontFamily={'heading'} fontSize={'sm'} color={'gray.200'} mt={4}>
        Aceita troca?
      </Text>

      <Controller
        control={control}
        name="accept_trade"
        defaultValue={productToEdit.accept_trade}
        render={({ field: { onChange, value } }) => (
          <Switch
            size="md"
            mt={2}
            offTrackColor={'gray.500'}
            onTrackColor="lightBlue.100"
            onToggle={onChange}
            value={value}
            isChecked={value}
          />
        )}
      />

      <Text fontFamily={'heading'} fontSize={'sm'} color={'gray.200'} mt={8}>
        Meios de pagamento aceitos
      </Text>

      <Controller
        control={control}
        name="payment_methods"
        defaultValue={productToEdit.payment_methods}
        render={({ field: { onChange, value } }) => (
          <PaymentsMethodsCheckbox
            onChange={onChange}
            value={value}
            defaultValue={productToEdit.payment_methods}
          />
        )}
      />

      <HStack justifyContent={'space-between'} mt={8} mb={12}>
        <Button
          text="Cancelar"
          colorText="gray.200"
          bgColor={'gray.500'}
          maxW={'48%'}
        />
        <Button
          text="Avançar"
          colorText="gray.700"
          bgColor={'gray.100'}
          maxW={'48%'}
          onPress={handleSubmit(handleEditProduct)}
        />
      </HStack>
    </ScrollView>
  )
}
