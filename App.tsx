import { Routes } from '@routes/index'
import { NativeBaseProvider, StatusBar } from 'native-base'

import {
  useFonts,
  Karla_400Regular,
  Karla_700Bold,
} from '@expo-google-fonts/karla'
import { Theme } from './src/theme'
import { Loading } from '@components/Loading'

export default function App() {
  const [fontsLoaded] = useFonts({ Karla_400Regular, Karla_700Bold })

  return (
    <NativeBaseProvider theme={Theme}>
      {fontsLoaded ? <Routes /> : <Loading />}
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        translucent
      />
    </NativeBaseProvider>
  )
}
