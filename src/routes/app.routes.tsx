import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs'

import { Home } from '@screens/Home'
import { Pressable, useTheme } from 'native-base'
import { Platform } from 'react-native'

import { House, Plus, SignOut, Tag } from 'phosphor-react-native'
import { useNavigation } from '@react-navigation/native'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { MyProducts } from '@screens/MyProducts'

type AppRoutes = {
  homeTab: undefined
  myProducts: undefined
  logout: undefined
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>()

function SignOutComponent() {
  const { signOut } = useContext(AuthContext)

  try {
    signOut()
  } catch (error) {}
  return null // Esta tela não terá conteúdo
}

export function AppRoutes() {
  const navigation = useNavigation()
  const { sizes, colors } = useTheme()

  const iconSize = sizes[6]

  return (
    <>
      <Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.gray[200],
          tabBarInactiveTintColor: colors.gray[400],
          tabBarStyle: {
            backgroundColor: colors.gray[700],
            borderTopWidth: 0,
            height: Platform.OS === 'android' ? 'auto' : 80,
          },
        }}
        initialRouteName="homeTab"
      >
        <Screen
          name="homeTab"
          options={{
            tabBarIcon: ({ color }) => (
              <House size={iconSize} weight="bold" color={color} />
            ),
          }}
          component={Home}
        />

        <Screen
          name="myProducts"
          options={{
            headerShown: true,
            headerTitle: 'Meus anúncios',
            headerStyle: {
              backgroundColor: '#EDECEE',
            },
            headerRight: () => (
              <Pressable
                mr={6}
                onPress={() => navigation.navigate('newProduct')}
              >
                <Plus />
              </Pressable>
            ),
            tabBarIcon: ({ color }) => (
              <Tag size={iconSize} weight="bold" color={color} />
            ),
          }}
          component={MyProducts}
        />

        <Screen
          name="logout"
          options={{
            tabBarIcon: () => (
              <SignOut size={iconSize} weight="bold" color={'#E07878'} />
            ),
          }}
          component={SignOutComponent}
        />
      </Navigator>
    </>
  )
}
