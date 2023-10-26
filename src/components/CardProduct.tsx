import { api } from '@services/api'
import { formatPrice } from '@utils/FormatPrice'
import { Box, Center, Heading, Image, Pressable, Text } from 'native-base'

interface ICardProduct {
  id: string
  image: string
  name: string
  price: number
  isNew: boolean
  isActive: boolean
  handleDetailsMyProduct: (idProduct: string) => void
}

export function CardProduct({
  id,
  image,
  isNew,
  name,
  price,
  isActive,
  handleDetailsMyProduct,
}: ICardProduct) {
  return (
    <Pressable w={'49%'} mt={8} onPress={() => handleDetailsMyProduct(id)}>
      <Center position={'relative'}>
        <Image
          source={{ uri: `${api.defaults.baseURL}/images/${image}` }}
          alt="Imagem do produto"
          w={'100%'}
          h={24}
          opacity={!isActive ? 60 : 100}
          borderRadius={'sm'}
        />

        <Box
          bgColor={isNew ? 'blue' : 'gray.200'}
          borderRadius={'full'}
          w={12}
          position={'absolute'}
          top={1}
          right={1}
          opacity={!isActive ? 60 : 100}
        >
          <Text
            color={'white'}
            fontFamily={'heading'}
            fontSize={'2xs'}
            textAlign={'center'}
          >
            {isNew ? 'NOVO' : 'USADO'}
          </Text>
        </Box>

        {!isActive && (
          <Text
            position={'absolute'}
            bottom={0}
            left={2}
            color={'gray.700'}
            fontFamily={'heading'}
          >
            ANÚNCIO DESATIVADO
          </Text>
        )}
      </Center>

      <Text
        fontSize={'sm'}
        color={'gray.200'}
        fontFamily={'body'}
        mt={1}
        opacity={!isActive ? 60 : 100}
      >
        {name}
      </Text>

      <Heading
        fontFamily={'heading'}
        fontSize={'xs'}
        opacity={!isActive ? 60 : 100}
      >
        R${' '}
        <Heading fontFamily={'heading'} fontSize={'md'}>
          {formatPrice(price)}
        </Heading>
      </Heading>
    </Pressable>
  )
}
