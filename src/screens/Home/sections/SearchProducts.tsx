import { Box, HStack, Input, Pressable, Text } from 'native-base'
import { MagnifyingGlass, Sliders } from 'phosphor-react-native'
import { Controller, useForm } from 'react-hook-form'

export type FormDataSearchProducts = {
  product: string
}

interface ISearchProducts {
  toogleModalFilters: () => void
  handleSearchProduct: (requestSearch: FormDataSearchProducts) => void
}

export function SearchProducts({
  toogleModalFilters,
  handleSearchProduct,
}: ISearchProducts) {
  const { control, handleSubmit } = useForm<FormDataSearchProducts>()

  return (
    <>
      <Text mt={6} mb={2} fontSize={'sm'} color={'gray.300'}>
        Compre produtos variados
      </Text>
      <Box position={'relative'}>
        <Controller
          control={control}
          name="product"
          render={({ field: { onChange } }) => (
            <Input
              bgColor={'gray.700'}
              height={12}
              borderWidth={0}
              w={'100%'}
              mb={3}
              fontSize={'md'}
              placeholder="Buscar anúncio"
              onChangeText={onChange}
            />
          )}
        />

        <HStack
          position={'absolute'}
          right={2}
          top={3}
          w={16}
          justifyContent={'space-between'}
        >
          <Pressable onPress={handleSubmit(handleSearchProduct)}>
            <MagnifyingGlass color="#3E3A40" size={24} weight="bold" />
          </Pressable>

          <Box w={0.4} bgColor={'gray.400'} />

          <Pressable onPress={toogleModalFilters}>
            <Sliders color="#3E3A40" size={24} weight="bold" />
          </Pressable>
        </HStack>
      </Box>
    </>
  )
}
