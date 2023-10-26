import { Checkbox, ICheckboxGroupProps, Text } from 'native-base'

interface PaymentsMethodsProps {
  label: string
  value: string
  isChecked: boolean
}

function PaymentsMethods({ label, value, isChecked }: PaymentsMethodsProps) {
  return (
    <Checkbox
      isChecked={isChecked}
      colorScheme="white"
      _checked={{
        backgroundColor: 'lightBlue.100',
        borderColor: 'lightBlue.100',
      }}
      value={value}
      borderWidth={2}
      borderColor={'gray.500'}
      flexDirection={'row'}
      p={1}
    >
      <Text fontSize={'md'} color={'gray.200'} ml={2} mt={2}>
        {label}
      </Text>
    </Checkbox>
  )
}

interface IPaymentsMethod extends ICheckboxGroupProps {
  value: Array<string>
}

export function PaymentsMethodsCheckbox({ value, ...rest }: IPaymentsMethod) {
  return (
    <Checkbox.Group {...rest}>
      <PaymentsMethods
        label="Boleto"
        value={'boleto'}
        isChecked={value?.includes('boleto')}
      />
      <PaymentsMethods
        label="Pix"
        value={'pix'}
        isChecked={value?.includes('pix')}
      />
      <PaymentsMethods
        label="Dinheiro"
        value={'cash'}
        isChecked={value?.includes('cash')}
      />
      <PaymentsMethods
        label="Cartão de crédito"
        value={'card'}
        isChecked={value?.includes('card')}
      />
      <PaymentsMethods
        label="Depósito Bancário"
        value={'deposit'}
        isChecked={value?.includes('deposit')}
      />
    </Checkbox.Group>
  )
}
