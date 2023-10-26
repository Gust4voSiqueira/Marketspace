import {
  Box,
  Center,
  CheckIcon,
  HStack,
  ScrollView,
  Select,
  Text,
  useToast,
} from 'native-base'
import { useCallback, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { AppError } from '@utils/AppError'
import { api } from '@services/api'
import { GetMyProductsDTO } from '@dtos/ProductDTO'
import { Loading } from '@components/Loading'
import { CardProduct } from '@components/CardProduct'

type FilterSelected = 'all' | 'active' | 'inactive'

export function MyProducts() {
  const navigation = useNavigation()
  const [myProducts, setMyProducts] = useState<GetMyProductsDTO[]>([])
  const [filteredList, setFilteredList] = useState<GetMyProductsDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const quantitieProducts =
    filteredList.length === 0 ? myProducts.length : filteredList.length

  const toast = useToast()

  function handleDetailsMyProduct(idProduct: string) {
    navigation.navigate('detailsMyProduct', { idProduct })
  }

  async function fetchMyProducts() {
    try {
      setIsLoading(true)
      const { data } = await api.get('/users/products')

      setMyProducts(data)
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
    } finally {
      setIsLoading(false)
    }
  }

  function filterProducts(filter: FilterSelected) {
    if (filter !== 'all') {
      const products = myProducts.filter((product) =>
        filter === 'active' ? product.is_active : !product.is_active,
      )
      setFilteredList(products)
      return
    }

    setFilteredList([])
  }

  useFocusEffect(
    useCallback(() => {
      fetchMyProducts()
    }, []),
  )

  if (isLoading) return <Loading />

  return (
    <Box p={6} bgColor={'gray.600'} flex={1}>
      <HStack justifyContent={'space-between'} alignItems={'center'}>
        <Text fontFamily={'body'} fontSize={'sm'} color={'gray.200'}>
          {quantitieProducts} anúncios
        </Text>

        <Select
          minWidth="32"
          height={9}
          accessibilityLabel="Todos"
          placeholder="Todos"
          placeholderTextColor={'gray.100'}
          _selectedItem={{
            bg: 'gray.300',
            endIcon: <CheckIcon size="2" />,
          }}
          mt={1}
          onValueChange={(itemValue) =>
            filterProducts(itemValue as FilterSelected)
          }
        >
          <Select.Item label="Todos" value="all" />
          <Select.Item label="Ativos" value="active" />
          <Select.Item label="Inativos" value="inactive" />
        </Select>
      </HStack>

      <Box
        flexWrap={'wrap'}
        justifyContent={'space-between'}
        flexDirection={'row'}
        pb={10}
      >
        <ScrollView>
          <Box
            flexWrap={'wrap'}
            justifyContent={'space-between'}
            flexDirection={'row'}
          >
            {filteredList.length === 0 && myProducts.length === 0 ? (
              <Center flex={1} mt={48}>
                <Text>Parece que você ainda não criou nenhum anúncio.</Text>
              </Center>
            ) : (
              (filteredList.length === 0 ? myProducts : filteredList).map(
                (myProduct) => (
                  <CardProduct
                    key={myProduct.id}
                    id={myProduct.id}
                    name={myProduct.name}
                    price={myProduct.price}
                    isNew={myProduct.is_new}
                    image={myProduct.product_images[0].path}
                    isActive={myProduct.is_active}
                    handleDetailsMyProduct={handleDetailsMyProduct}
                  />
                ),
              )
            )}
          </Box>
        </ScrollView>
      </Box>
    </Box>
  )
}
