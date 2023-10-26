import { NavigationContainer, DefaultTheme } from '@react-navigation/native'

import { useTheme, Box } from 'native-base'
import { AppStackRoutes } from './app.stack.routes'
import { AuthRoutes } from './auth.routes'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export function Routes() {
  const { user } = useContext(AuthContext)
  const { colors } = useTheme()

  const theme = DefaultTheme
  theme.colors.background = colors.gray[700]

  return (
    <Box flex={1} bg={colors.gray[700]}>
      <NavigationContainer theme={theme}>
        {user?.email ? <AppStackRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}
