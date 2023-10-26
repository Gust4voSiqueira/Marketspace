import { useNavigation } from '@react-navigation/native'
import { HStack, Heading, Pressable, Text, VStack } from 'native-base'
import { ArrowRight, Tag } from 'phosphor-react-native'

interface ICardMyProduct {
  quantitieAds: number
}

export function CardMyProduct({ quantitieAds }: ICardMyProduct) {
  const navigation = useNavigation()

  return (
    <>
      <Text mt={8} fontSize={'sm'} color={'gray.300'}>
        Seus produtos anunciados para venda
      </Text>

      <HStack
        justifyContent={'space-between'}
        alignItems={'center'}
        bgColor={'rgba(100, 122, 199, 0.10)'}
        borderRadius={'md'}
        p={4}
        mt={2}
      >
        <HStack alignItems={'center'}>
          <Tag size={28} color="#364D9D" />
          <VStack marginLeft={4}>
            <Heading fontFamily={'heading'} fontSize={'lg'}>
              {quantitieAds}
            </Heading>
            <Text fontSize={'xs'} color={'gray.200'}>
              anúncios ativos
            </Text>
          </VStack>
        </HStack>

        <Pressable onPress={() => navigation.navigate('myProducts')}>
          <HStack alignItems={'center'}>
            <Text color={'blue'} fontFamily={'heading'} mr={2} fontSize={'xs'}>
              Meus anúncios
            </Text>
            <ArrowRight size={20} color="#364D9D" />
          </HStack>
        </Pressable>
      </HStack>
    </>
  )
}
