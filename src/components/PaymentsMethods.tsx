import { payment_methods } from '@dtos/ProductDTO'
import { Box, HStack, Text, VStack } from 'native-base'
import { Bank, Barcode, CreditCard, Money, QrCode } from 'phosphor-react-native'

const paymentsMethodsItems = {
  boleto: (
    <HStack alignItems={'center'} mb={2}>
      <Barcode size={24} color="#1A181B" />
      <Text color={'gray.200'} fontSize={'sm'} ml={2}>
        Boleto
      </Text>
    </HStack>
  ),
  pix: (
    <HStack alignItems={'center'} mb={2}>
      <QrCode size={24} color="#1A181B" />
      <Text color={'gray.200'} fontSize={'sm'} ml={2}>
        Pix
      </Text>
    </HStack>
  ),
  card: (
    <HStack alignItems={'center'} mb={2}>
      <CreditCard size={24} color="#1A181B" />
      <Text color={'gray.200'} fontSize={'sm'} ml={2}>
        Cartão de Crédito
      </Text>
    </HStack>
  ),
  cash: (
    <HStack alignItems={'center'} mb={2}>
      <Money size={24} color="#1A181B" />
      <Text color={'gray.200'} fontSize={'sm'} ml={2}>
        Dinheiro
      </Text>
    </HStack>
  ),
  deposit: (
    <HStack alignItems={'center'} mb={2}>
      <Bank size={24} color="#1A181B" />
      <Text color={'gray.200'} fontSize={'sm'} ml={2}>
        Depósito Bancário
      </Text>
    </HStack>
  ),
}

interface IPaymentsMethods {
  paymentsMethods: Array<payment_methods>
}

export function PaymentsMethods({ paymentsMethods }: IPaymentsMethods) {
  return (
    <VStack>
      <Text fontFamily={'heading'} fontSize={'sm'} mb={2}>
        Meios de pagamento:
      </Text>

      {paymentsMethods.map((method) => (
        <Box key={method}>{paymentsMethodsItems[method]}</Box>
      ))}
    </VStack>
  )
}
