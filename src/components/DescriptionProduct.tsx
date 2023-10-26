import { formatPrice } from '@utils/FormatPrice'
import { Box, HStack, Heading, Text } from 'native-base'

interface IDescriptionProduct {
  is_new: boolean
  title: string
  description: string
  price: number
  accept_trade: boolean
}

export function DescriptionProduct({
  is_new,
  title,
  description,
  price,
  accept_trade,
}: IDescriptionProduct) {
  return (
    <>
      <Box
        bgColor={'gray.500'}
        borderRadius={'full'}
        px={2}
        py={1}
        w={20}
        mt={6}
        mb={2}
      >
        <Text
          color={'gray.200'}
          fontFamily={'heading'}
          fontSize={'xs'}
          textAlign={'center'}
        >
          {is_new ? 'NOVO' : 'USADO'}
        </Text>
      </Box>

      <HStack justifyContent={'space-between'} alignItems={'center'}>
        <Heading fontFamily={'heading'} fontSize={'lg'}>
          {title}
        </Heading>
        <Heading
          color={'lightBlue.100'}
          fontFamily={'heading'}
          fontSize={'sm'}
          pt={1}
        >
          R$
          <Heading
            color={'lightBlue.100'}
            fontFamily={'heading'}
            fontSize={'lg'}
          >
            {formatPrice(price)}
          </Heading>
        </Heading>
      </HStack>

      <Text fontSize={'sm'} fontFamily={'body'} color={'gray.200'} mt={2}>
        {description}
      </Text>

      <Text fontFamily={'heading'} fontSize={'sm'} my={6}>
        Aceita troca?{' '}
        <Text fontFamily={'body'}>{accept_trade ? 'Sim' : 'Não'}</Text>
      </Text>
    </>
  )
}
