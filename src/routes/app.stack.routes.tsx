import { useNavigation } from '@react-navigation/native'
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'
import { DetailsProduct } from '@screens/DetailsProduct'
import { Pressable } from 'native-base'
import { ArrowLeft } from 'phosphor-react-native'
import { AppRoutes } from './app.routes'
import { ResumeProduct } from '@screens/ResumeProduct'
import { NewProduct } from '@screens/NewProduct'
import { DetailsMyProduct } from '@screens/DetailsMyAd'
import { EditProduct } from '@screens/EditProduct'

type AppStackRoutes = {
  home: undefined
  details: { idProduct: string }
  resumeProduct: undefined
  myProducts: undefined
  newProduct: undefined
  editProduct: undefined
  detailsMyProduct: { idProduct: string }
}

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AppStackRoutes>

const { Navigator, Screen } = createNativeStackNavigator<AppStackRoutes>()

export function AppStackRoutes() {
  const navigation = useNavigation()

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: '#fff' },
      }}
      initialRouteName="home"
    >
      <Screen
        name="home"
        component={AppRoutes}
        options={{
          headerTitle: '',
          headerLeft: () => (
            <Pressable ml={6} onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color="#1A181B" />
            </Pressable>
          ),
        }}
      />

      <Screen
        name="details"
        component={DetailsProduct}
        options={{
          headerShown: true,
          headerTitle: '',
          headerLeft: () => (
            <Pressable ml={6} onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color="#1A181B" />
            </Pressable>
          ),
        }}
      />

      <Screen
        name="detailsMyProduct"
        component={DetailsMyProduct}
        options={{
          headerShown: false,
        }}
      />

      <Screen
        name="newProduct"
        component={NewProduct}
        options={{
          headerShown: true,
          headerTitle: 'Criar anúncio',
          headerStyle: {
            backgroundColor: '#EDECEE',
          },
          headerLeft: () => (
            <Pressable onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color="#1A181B" />
            </Pressable>
          ),
        }}
      />

      <Screen
        name="editProduct"
        component={EditProduct}
        options={{
          headerShown: true,
          headerTitle: 'Editar anúncio',
          headerStyle: {
            backgroundColor: '#EDECEE',
          },
          headerLeft: () => (
            <Pressable onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color="#1A181B" />
            </Pressable>
          ),
        }}
      />

      <Screen
        name="resumeProduct"
        component={ResumeProduct}
        options={{
          headerShown: false,
        }}
      />
    </Navigator>
  )
}
