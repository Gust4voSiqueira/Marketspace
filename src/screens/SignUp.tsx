import { useContext, useEffect, useState } from 'react'
import {
  Center,
  Heading,
  Image,
  Pressable,
  ScrollView,
  Skeleton,
  Text,
  useToast,
} from 'native-base'

import Logo from '@assets/logo.svg'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { useNavigation } from '@react-navigation/native'
import { PencilSimpleLine } from 'phosphor-react-native'

import defaultImage from '@assets/defaultImage.png'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { AppError } from '@utils/AppError'
import { UserSignUpDTO } from '@dtos/UserDTO'
import { AuthContext } from '../context/AuthContext'

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe o e-mail.').email('E-mail inválido'),
  phone: yup
    .string()
    .required('Informe o telefone.')
    .min(13, 'Adicione o telefone no formato DDI+DDD+número')
    .max(13, 'Adicione o telefone no formato DDI+DDD+número'),
  password: yup
    .string()
    .required('Informe a senha.')
    .min(6, 'A senha deve ter no mínimo 6 dígitos.'),
  password_confirm: yup
    .string()
    .required('Confirme a senha.')
    .oneOf([yup.ref('password'), ''], 'A confirmação da senha não confere.'),
})

export function SignUp() {
  const [photoSelected, setPhotoSelected] =
    useState<ImagePicker.ImagePickerAsset>()
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const { signUp } = useContext(AuthContext)
  const navigation = useNavigation()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSignUpDTO>({
    resolver: yupResolver(signUpSchema),
  })

  const toast = useToast()

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true)
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
        base64: true,
      })

      if (photoSelected.canceled) return

      if (photoSelected.assets[0].uri) {
        const photoInfo = (await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri,
        )) as any

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: 'Essa imagem é muito grande. escolha uma de até 5MB.',
            placement: 'top',
            bgColor: 'red.500',
          })
        }

        const photo = photoSelected.assets[0]

        setPhotoSelected(photo)
      }
    } catch (error) {
      toast.show({
        title: 'Falha ao selecionar imagem.',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setPhotoIsLoading(false)
    }
  }

  async function handleSignUp(userRequest: UserSignUpDTO) {
    try {
      if (!photoSelected) {
        throw new AppError('Selecione uma imagem de perfil.')
      }

      await signUp(userRequest, photoSelected)
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

  useEffect(() => {
    Object.values(errors).map((error) =>
      toast.show({
        title: error.message,
        placement: 'top',
        bgColor: 'red.500',
      }),
    )
  }, [errors])

  const PHOTO_SIZE = 24

  return (
    <ScrollView pb={20} py={10} px={10} height={'100%'} bgColor={'gray.600'}>
      <Center flex={1}>
        <Logo />
        <Heading fontFamily={'heading'}>Boas vindas!</Heading>
        <Text
          textAlign={'center'}
          color={'gray.200'}
          fontSize={'sm'}
          fontFamily={'mono'}
          mt={2}
        >
          Crie sua conta e use o espaço para comprar itens variados e vender
          seus produtos
        </Text>

        {!photoIsLoading ? (
          <Pressable mt={6} mb={4} onPress={handleUserPhotoSelect}>
            <Image
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              source={photoSelected ? { uri: photoSelected.uri } : defaultImage}
              rounded={'full'}
              borderWidth={2}
              borderColor={'gray.400'}
              alt="Imagem do usuário"
              position={'relative'}
            />

            <Center
              bgColor={'lightBlue.100'}
              borderRadius={'full'}
              w={10}
              h={10}
              position={'absolute'}
              bottom={0}
              right={-5}
            >
              <PencilSimpleLine color="white" size={20} />
            </Center>
          </Pressable>
        ) : (
          <Skeleton
            w={PHOTO_SIZE}
            h={PHOTO_SIZE}
            rounded="full"
            startColor="gray.500"
            endColor="gray.400"
            mt={6}
            mb={4}
          />
        )}

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Nome"
              isError={!!errors.name?.message}
              onChangeText={onChange}
              value={value}
              autoCorrect={false}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="E-mail"
              isError={!!errors.email?.message}
              autoCapitalize="none"
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Telefone"
              onChangeText={onChange}
              isError={!!errors.phone?.message}
              value={value}
              keyboardType="numeric"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Senha"
              isError={!!errors.password?.message}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />

        <Controller
          control={control}
          name="password_confirm"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Confirmar Senha"
              isError={!!errors.password_confirm?.message}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />

        <Button
          text="Criar"
          colorText="gray.700"
          bgColor={'gray.100'}
          mt={3}
          py={3}
          onPress={handleSubmit(handleSignUp)}
        />

        <Text fontSize={'sm'} color={'gray.200'} mt={8}>
          Já tem uma conta?
        </Text>
        <Button
          text="Ir para login"
          colorText="gray.200"
          bgColor={'gray.500'}
          mt={2}
          py={3}
          onPress={() => navigation.navigate('signIn')}
        />
      </Center>
    </ScrollView>
  )
}
