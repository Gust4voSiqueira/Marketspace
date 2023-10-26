import { api } from '@services/api'
import { HStack, Image, Text } from 'native-base'

interface IInfoSeller {
  name: string
  avatar: string
}

export function InfoSeller({ name, avatar }: IInfoSeller) {
  return (
    <HStack alignItems={'center'}>
      <Image
        source={{ uri: `${api.defaults.baseURL}/images/${avatar}` }}
        alt="Imagem do vendedor"
        width={6}
        height={6}
        borderRadius={'full'}
        borderWidth={1}
        borderColor={'lightBlue.100'}
      />
      <Text fontSize={'sm'} ml={2} fontFamily={'body'}>
        {name}
      </Text>
    </HStack>
  )
}
