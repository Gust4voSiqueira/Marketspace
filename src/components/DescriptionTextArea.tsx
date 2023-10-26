import { ITextAreaProps, TextArea } from 'native-base'

interface IDescription extends ITextAreaProps {
  value: string
  isError: boolean
}

export function DescriptionTextArea({ value, isError, ...rest }: IDescription) {
  return (
    <TextArea
      autoCompleteType={false}
      bgColor={'gray.700'}
      numberOfLines={5}
      borderWidth={1}
      borderColor={isError ? 'lightRed' : 'gray.700'}
      mb={3}
      fontSize={'md'}
      placeholder="Descrição do produto"
      value={value}
      color={'gray.200'}
      _focus={{
        borderColor: 'gray.700',
      }}
      {...rest}
    />
  )
}
