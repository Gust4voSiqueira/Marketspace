import { Box, Center, Heading, Text, useToast } from 'native-base'

import Logo from '@assets/logo.svg'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { useNavigation } from '@react-navigation/native'
import { Controller, useForm } from 'react-hook-form'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { AppError } from '@utils/AppError'

type FormData = {
  email: string
  password: string
}

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const { signIn } = useContext(AuthContext)
  const navigation = useNavigation()

  const toast = useToast()

  async function handleSignIn(data: FormData) {
    try {
      setIsLoading(true)
      await signIn(data.email, data.password)
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Não foi possível entrar na sua conta. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box flex={1}>
      <Box bgColor={'gray.600'} h={'65%'} borderBottomRadius={'3xl'} pt={24}>
        <Box alignItems={'center'}>
          <Logo width={95} height={65} />
          <Heading fontFamily={'heading'} color={'gray.100'} fontSize={'3xl'}>
            marketspace
          </Heading>
          <Text color={'gray.300'} fontSize={'sm'}>
            Seu espaço de compra e venda
          </Text>
        </Box>

        <Box paddingX={50} marginTop={70}>
          <Text textAlign={'center'} fontSize={'sm'} color={'gray.200'} mb={3}>
            Acesse sua conta
          </Text>

          <Controller
            control={control}
            name="email"
            rules={{ required: 'Informe o e-mail' }}
            render={({ field: { onChange } }) => (
              <Input
                placeholder="E-mail"
                autoCapitalize="none"
                isError={!!errors.email?.message}
                autoCorrect={false}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{ required: 'Informe a senha' }}
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Senha"
                isError={!!errors.password?.message}
                secureTextEntry
                onChangeText={onChange}
              />
            )}
          />

          <Button
            text="Entrar"
            bgColor={'lightBlue.100'}
            colorText="gray.700"
            isLoading={isLoading}
            onPress={handleSubmit(handleSignIn)}
          />
        </Box>
      </Box>

      <Center h={'35%'} paddingX={50}>
        <Text mb={3} fontSize={'sm'} color={'gray.200'}>
          Ainda não tem acesso?
        </Text>
        <Button
          text="Criar uma conta"
          colorText="gray.200"
          bgColor={'gray.500'}
          onPress={() => navigation.navigate('signUp')}
        />
      </Center>
    </Box>
  )
}
