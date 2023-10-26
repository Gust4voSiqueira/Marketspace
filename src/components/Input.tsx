import { TextInputProps } from 'react-native'

import { Input as InputNative } from 'native-base'

interface IInput extends TextInputProps {
  isError?: boolean
}

export function Input({ isError = false, ...rest }: IInput) {
  return (
    <InputNative
      bgColor={'gray.700'}
      paddingY={20}
      height={12}
      borderWidth={1}
      w={'100%'}
      mb={3}
      fontSize={'md'}
      color={'gray.200'}
      borderColor={isError ? 'lightRed' : 'gray.700'}
      _focus={{
        borderColor: 'gray.700',
      }}
      {...rest}
    />
  )
}
