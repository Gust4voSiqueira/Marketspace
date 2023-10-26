import { useNavigation } from '@react-navigation/native'
import { api } from '@services/api'
import { Button, HStack, Heading, Image, Text, VStack } from 'native-base'
import { Plus } from 'phosphor-react-native'

interface IHeaderHomeProps {
  name: string
  avatar: string
}

export function HeaderHome({ name, avatar }: IHeaderHomeProps) {
  const navigation = useNavigation()

  return (
    <HStack w={'100%'} justifyContent={'space-between'}>
      <HStack justifyContent={'center'}>
        <Image
          source={{ uri: `${api.defaults.baseURL}/images/${avatar}` }}
          alt="Foto de perfil"
          w={12}
          h={12}
          borderRadius={'full'}
          borderWidth={2}
          borderColor={'lightBlue.100'}
          mr={2}
        />

        <VStack>
          <Text color={'gray.200'} fontSize={'md'}>
            Boas vindas,
          </Text>
          <Heading fontFamily={'heading'} fontSize={'md'}>
            {name}!
          </Heading>
        </VStack>
      </HStack>

      <Button
        bgColor={'gray.100'}
        onPress={() => navigation.navigate('newProduct')}
      >
        <HStack justifyContent={'space-between'}>
          <Plus size={20} color="#F7F7F8" weight="bold" />
          <Text color={'gray.700'} ml={2} fontFamily={'heading'}>
            Criar anúncio
          </Text>
        </HStack>
      </Button>
    </HStack>
  )
}
