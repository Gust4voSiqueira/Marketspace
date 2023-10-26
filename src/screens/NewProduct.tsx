import { yupResolver } from '@hookform/resolvers/yup'
import {
  Text,
  Heading,
  Switch,
  ScrollView,
  HStack,
  useToast,
  Box,
  Image,
  Pressable,
} from 'native-base'
import { useCallback, useContext, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import * as yup from 'yup'

import { PaymentsMethodsCheckbox } from '../components/PaymentsMethodsCheckbox'
import { AppError } from '@utils/AppError'
import { ProductDTO } from '@dtos/ProductDTO'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { Loading } from '@components/Loading'
import { formatPrice } from '@utils/FormatPrice'

import {
  storageProductGet,
  storageProductImagesGet,
} from '@storage/storageProducts'
import { NewProductRequest, ProductsContext } from '../context/ProductsContext'
import { ImagesInput } from '../components/ImagesInput'
import { DescriptionTextArea } from '../components/DescriptionTextArea'
import { IsNewRadio } from '../components/IsNewRadio'
import { X } from 'phosphor-react-native'

const newProductSchema = yup.object({
  name: yup.string().required('Informe o nome do produto.'),
  description: yup.string().required('Informe a descrição do produto.'),
  is_new: yup.string().required('Informe se o produto é novo ou usado.'),
  accept_trade: yup.boolean().default(false),
  payment_methods: yup
    .array()
    .required('Informe quais serão as formas de pagamento aceitas.'),
  price: yup.string().required('Informe o preço do produto.'),
})

export function NewProduct() {
  const [imagesSelected, setImagesSelected] = useState<
    ImagePicker.ImagePickerAsset[]
  >([])
  const [loading, setLoading] = useState(true)
  const [defaultValues, setDefaultValues] = useState<ProductDTO>(
    {} as ProductDTO,
  )
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewProductRequest>({
    resolver: yupResolver(newProductSchema),
  })

  const toast = useToast()
  const navigate = useNavigation()

  const { saveProductStorage } = useContext(ProductsContext)

  async function handleNewProduct(data: NewProductRequest) {
    try {
      if (imagesSelected.length === 0) {
        throw new AppError('Selecione as imagens do produto.')
      }

      await saveProductStorage(data, imagesSelected)
      navigate.navigate('resumeProduct')
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Não foi possível publicar o anúncio. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  function handleAddImage(image: ImagePicker.ImagePickerAsset) {
    setImagesSelected([...imagesSelected, image])
  }

  function handleRemoveImage(imageRemoved: ImagePicker.ImagePickerAsset) {
    const imagesFiltered = imagesSelected.filter(
      (image) => image !== imageRemoved,
    )
    setImagesSelected(imagesFiltered)
  }

  async function fetchProductInStorage() {
    try {
      setLoading(true)
      const response = await storageProductGet()
      const images = await storageProductImagesGet()

      if (response?.name) {
        setDefaultValues(response)
        setImagesSelected(images)
      }
    } catch (error) {
      toast.show({
        title: 'Falha ao acessar anúncios salvos.',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchProductInStorage()
    }, []),
  )

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
        quantitieImagesSelected={imagesSelected.length}
        handleAddImage={handleAddImage}
      >
        {imagesSelected.map((image) => (
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
              onPress={() => handleRemoveImage(image)}
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
        defaultValue={defaultValues.name}
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
        defaultValue={defaultValues.description}
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
        defaultValue={
          defaultValues.is_new ? (defaultValues.is_new ? 'new' : 'usage') : ''
        }
        render={({ field: { onChange } }) => (
          <IsNewRadio
            name="new"
            onChange={onChange}
            defaultValue={
              defaultValues.is_new !== undefined
                ? defaultValues.is_new
                  ? 'new'
                  : 'usage'
                : ''
            }
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
          defaultValues.price > 0
            ? `R$ ${formatPrice(defaultValues.price)}`
            : 'R$ '
        }
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Valor do produto"
            onChangeText={onChange}
            value={value}
            defaultValue={
              defaultValues.price > 0
                ? `R$ ${formatPrice(defaultValues.price)}`
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
        defaultValue={defaultValues.accept_trade}
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
        defaultValue={defaultValues.payment_methods}
        render={({ field: { onChange, value } }) => (
          <PaymentsMethodsCheckbox
            onChange={onChange}
            value={value}
            defaultValue={defaultValues.payment_methods}
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
          onPress={handleSubmit(handleNewProduct)}
        />
      </HStack>
    </ScrollView>
  )
}
