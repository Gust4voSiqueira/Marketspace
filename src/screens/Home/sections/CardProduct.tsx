import { api } from '@services/api'
import { formatPrice } from '@utils/FormatPrice'
import { Center, HStack, Heading, Image, Pressable, Text } from 'native-base'

interface ICardProduct {
  id: string
  name: string
  price: number
  isNew: boolean
  image: string
  avatarUser: string
  handleRedirect: (idProduct: string) => void
}

export function CardProduct({
  id,
  name,
  price,
  isNew,
  image,
  avatarUser,
  handleRedirect,
}: ICardProduct) {
  return (
    <Pressable
      w={'48%'}
      mb={4}
      position={'relative'}
      onPress={() => handleRedirect(id)}
    >
      <HStack
        w={'100%'}
        position={'absolute'}
        top={0}
        zIndex={3}
        justifyContent={'space-between'}
        p={1}
      >
        <Image
          source={{ uri: `${api.defaults.baseURL}/images/${avatarUser}` }}
          alt="Imagem do vendedor"
          width={6}
          height={6}
          borderRadius={'full'}
          borderWidth={1}
          borderColor={'white'}
        />

        <Center
          bgColor={isNew ? 'blue' : 'gray.200'}
          borderRadius={'full'}
          px={3}
        >
          <Heading color={'white'} fontFamily={'heading'} fontSize={'2xs'}>
            {isNew ? 'NOVO' : 'USADO'}
          </Heading>
        </Center>
      </HStack>

      <Image
        source={{ uri: `${api.defaults.baseURL}/images/${image}` }}
        alt={name}
        width={'100%'}
        height={100}
        borderRadius={'md'}
      />

      <Text fontSize={'sm'} color={'gray.200'} mt={1}>
        {name}
      </Text>
      <HStack alignItems={'flex-end'}>
        <Heading fontFamily={'heading'} fontSize={'sm'}>
          R$
        </Heading>
        <Heading fontFamily={'heading'} fontSize={'md'} ml={1}>
          {formatPrice(price)}
        </Heading>
      </HStack>
    </Pressable>
  )
}
