import { IRadioGroupProps, Radio, Text } from 'native-base'

export function IsNewRadio({ ...rest }: IRadioGroupProps) {
  return (
    <Radio.Group accessibilityLabel="new" flexDir={'row'} {...rest}>
      <Radio value="new" my={1} borderWidth={1}>
        <Text fontFamily={'body'} fontSize={'md'} color={'gray.200'}>
          Produto novo
        </Text>
      </Radio>
      <Radio
        value="usage"
        my={1}
        ml={4}
        borderColor={'gray.400'}
        borderWidth={1}
      >
        <Text fontFamily={'body'} fontSize={'md'} color={'gray.200'}>
          Produto usado
        </Text>
      </Radio>
    </Radio.Group>
  )
}
