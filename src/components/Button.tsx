import { Text, Button as ButtonNative, IButtonProps } from 'native-base'

type ButtonProps = IButtonProps & {
  text: string
  colorText: string
}

export function Button({ text, colorText, ...rest }: ButtonProps) {
  return (
    <ButtonNative w={'100%'} {...rest}>
      <Text color={colorText} fontFamily={'heading'} fontSize={'sm'}>
        {text}
      </Text>
    </ButtonNative>
  )
}
