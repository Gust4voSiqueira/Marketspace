import {
  Box,
  HStack,
  Pressable,
  Image as ImageNative,
  Text,
  Center,
} from 'native-base'

interface IImageProduct {
  handleAlterImage: (newIndex: number) => void
  indexImage: number
  images: Array<string>
  isActive?: boolean
}

export function ImagesProduct({
  handleAlterImage,
  indexImage,
  images,
  isActive = true,
}: IImageProduct) {
  return (
    <Box position={'relative'}>
      <Pressable
        bgColor={'black'}
        width={'30%'}
        h={280}
        position={'absolute'}
        zIndex={5}
        opacity={0}
        onPress={() => handleAlterImage(indexImage - 1)}
      />

      <Center bgColor={'black'} width={'50%'} ml={'30%'} w={40}>
        {!isActive && (
          <Text
            position={'absolute'}
            fontFamily={'heading'}
            top={280 / 2 - 4}
            color={'black'}
            fontSize={'sm'}
          >
            ANÚNCIO DESATIVADO
          </Text>
        )}
      </Center>

      <ImageNative
        source={{
          uri: images[indexImage],
        }}
        alt="Imagem do produto"
        h={280}
        opacity={!isActive ? 0.5 : 1}
      />
      <Pressable
        bgColor={'black'}
        width={'30%'}
        h={280}
        right={0}
        position={'absolute'}
        zIndex={5}
        opacity={0}
        onPress={() => handleAlterImage(indexImage + 1)}
      />
      <HStack
        justifyContent={'space-between'}
        position={'absolute'}
        w={'100%'}
        bottom={1}
      >
        {images.length > 1 &&
          images.map((imageIndex: string) => (
            <Pressable
              key={imageIndex}
              bgColor={'gray.700'}
              w={'32%'}
              height={1}
              opacity={imageIndex === images[indexImage] ? 75 : 50}
              borderRadius={'full'}
            />
          ))}
      </HStack>
    </Box>
  )
}
