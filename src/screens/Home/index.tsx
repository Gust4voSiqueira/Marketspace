import { HeaderHome } from '@screens/Home/sections/Header'
import { Box, Center, ScrollView, Text, useToast } from 'native-base'
import { SafeAreaView } from 'react-native'
import {
  FormDataSearchProducts,
  SearchProducts,
} from './sections/SearchProducts'
import { CardProduct } from './sections/CardProduct'
import { useCallback, useContext, useState } from 'react'
import { Filters, IFiltersFields } from './sections/Filters'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { AuthContext } from '../../context/AuthContext'
import { Loading } from '@components/Loading'
import { api } from '@services/api'
import { GetAllProductsDTO } from '@dtos/ProductDTO'
import { CardMyProduct } from './sections/CardMyProduct'
import { AppError } from '@utils/AppError'

export function Home() {
  const [products, setProducts] = useState<GetAllProductsDTO[]>([])
  const [myProducts, setMyProducts] = useState<GetAllProductsDTO[]>([])
  const [isOpenFilters, setIsOpenFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<IFiltersFields>({})

  const toast = useToast()
  const { user } = useContext(AuthContext)
  const navigate = useNavigation()

  function handleToggleModal() {
    setIsOpenFilters(!isOpenFilters)
  }

  function handleRedirect(idProduct: string) {
    navigate.navigate('details', { idProduct })
  }

  async function fetchProducts() {
    try {
      setIsLoading(true)
      const { data } = await api.get('/products')
      const response = await api.get('/users/products')

      setMyProducts(response.data)
      setProducts(data)
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Erro ao buscar os anúncios. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleClearFilters() {
    fetchProducts()
    setIsOpenFilters(false)
    setFilters({})
  }

  async function fetchProductsFiltered(filtersParams: IFiltersFields) {
    try {
      const { data } = await api.get(`/products`, {
        params: {
          is_new: filtersParams.is_new === 'new',
          payment_methods: filtersParams.payment_methods,
          accept_trade: filtersParams.accept_trade,
        },
      })

      setFilters(filtersParams)

      handleToggleModal()
      setProducts(data)
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Erro ao filtrar os anúncios. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  async function handleSearchProduct(requestSearch: FormDataSearchProducts) {
    try {
      const { data } = await api.get('/products', {
        params: {
          query: requestSearch.product,
        },
      })

      setProducts(data)
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
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchProducts()
    }, []),
  )

  if (!user || isLoading) return <Loading />

  return (
    <SafeAreaView>
      {isOpenFilters && (
        <Filters
          toggleModal={handleToggleModal}
          handleFilter={fetchProductsFiltered}
          clearFilters={handleClearFilters}
          is_new={filters.is_new}
          accept_trade={filters.accept_trade}
          payment_methods={filters.payment_methods}
        />
      )}
      <ScrollView paddingX={6} paddingTop={4} h={'100%'} bgColor={'gray.600'}>
        <HeaderHome name={user.name} avatar={user.avatar} />
        <CardMyProduct quantitieAds={myProducts.length} />
        <SearchProducts
          toogleModalFilters={handleToggleModal}
          handleSearchProduct={handleSearchProduct}
        />
        {products.length > 0 ? (
          <Box
            flexWrap={'wrap'}
            justifyContent={'space-between'}
            flexDirection={'row'}
            pb={10}
          >
            {products.map((product) => (
              <CardProduct
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                isNew={product.is_new}
                image={product.product_images[0]?.path}
                handleRedirect={handleRedirect}
                avatarUser={product.user.avatar}
              />
            ))}
          </Box>
        ) : (
          <Center height={40}>
            <Text textAlign={'center'}>
              Parece que não há nenhum produto cadastrado ainda.
            </Text>
          </Center>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
