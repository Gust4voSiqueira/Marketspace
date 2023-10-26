import { Routes } from '@routes/index'
import { NativeBaseProvider } from 'native-base'

import {
  useFonts,
  Karla_400Regular,
  Karla_700Bold,
} from '@expo-google-fonts/karla'
import { Theme } from './src/theme'
import { Loading } from '@components/Loading'
import { StatusBar } from 'react-native'
import { AuthContextProvider } from './src/context/AuthContext'
import { ProductsContextProvider } from './src/context/ProductsContext'

export default function App() {
  const [fontsLoaded] = useFonts({ Karla_400Regular, Karla_700Bold })

  return (
    <AuthContextProvider>
      <ProductsContextProvider>
        <NativeBaseProvider theme={Theme}>
          {fontsLoaded ? <Routes /> : <Loading />}
          <StatusBar
            barStyle={'dark-content'}
            backgroundColor={'#EDECEE'}
            translucent
          />
        </NativeBaseProvider>
      </ProductsContextProvider>
    </AuthContextProvider>
  )
}
