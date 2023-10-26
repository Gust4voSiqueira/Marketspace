import { Button } from '@components/Button'
import { PaymentsMethodsCheckbox } from '@components/PaymentsMethodsCheckbox'
import { payment_methods } from '@dtos/ProductDTO'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Center, Checkbox, HStack, Modal, Switch, Text } from 'native-base'
import { X } from 'phosphor-react-native'
import { Controller, useForm } from 'react-hook-form'

import * as yup from 'yup'

interface IOptionsCheckbox {
  value?: string
  label: string
  onChange: (newValue: string) => void
}

function OptionsCheckbox({ value, label, onChange }: IOptionsCheckbox) {
  const isChecked = value === label

  return (
    <Center
      py={1}
      w={20}
      borderRadius={'full'}
      mr={2}
      bgColor={isChecked ? 'lightBlue.100' : 'gray.500'}
    >
      <Checkbox
        isChecked={isChecked}
        colorScheme="gray.600"
        onChange={(newValue) => onChange(newValue ? label : '')}
        _checked={{
          backgroundColor: 'lightBlue.100',
          borderWidth: 0,
        }}
        borderWidth={0}
        flexDirection={'row-reverse'}
        size={'sm'}
        value={label}
        icon={
          <Center bgColor={'white'} borderRadius={'full'} w={3} h={3} mx={1}>
            <X color={isChecked ? '#647AC7' : '#D9D8DA'} size={10} />
          </Center>
        }
      >
        <Text
          textAlign={'center'}
          fontSize={'md'}
          color={isChecked ? 'white' : 'gray.200'}
        >
          {label === 'new' ? 'NOVO' : 'USADO'}
        </Text>
      </Checkbox>
    </Center>
  )
}

export interface IFiltersFields {
  is_new?: string
  accept_trade?: boolean
  payment_methods?: payment_methods[]
}

const filterProductsSchema = yup.object({
  is_new: yup.string(),
  accept_trade: yup.boolean(),
  payment_methods: yup.array(),
})

interface IFilters {
  toggleModal: () => void
  handleFilter: (filters: IFiltersFields) => void
  clearFilters: () => void
  is_new?: string
  accept_trade?: boolean
  payment_methods?: payment_methods[]
}

export function Filters({
  toggleModal,
  handleFilter,
  accept_trade,
  is_new,
  payment_methods,
  clearFilters,
}: IFilters) {
  const { control, handleSubmit, reset } = useForm<IFiltersFields>({
    resolver: yupResolver(filterProductsSchema),
    defaultValues: {
      is_new,
      accept_trade,
      payment_methods,
    },
  })

  function handleClearFilters() {
    clearFilters()
    reset()
  }

  return (
    <Modal isOpen={true} onClose={toggleModal}>
      <Modal.Content
        w={'100%'}
        h={'75%'}
        position={'absolute'}
        bottom={0}
        bgColor={'gray.600'}
      >
        <Modal.CloseButton />
        <Modal.Header borderBottomColor={'transparent'} bgColor={'gray.600'}>
          <Text fontFamily={'heading'} fontSize={'lg'} color={'gray.100'}>
            Filtrar anúncios
          </Text>
        </Modal.Header>

        <Modal.Body>
          <Box mt={10}>
            <Text fontFamily={'heading'} fontSize={'sm'} color={'gray.200'}>
              Condição
            </Text>

            <HStack mt={2}>
              <Controller
                control={control}
                name="is_new"
                render={({ field: { onChange, value } }) => (
                  <Checkbox.Group
                    w={40}
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                    value={value}
                  >
                    <OptionsCheckbox
                      value={value}
                      label="new"
                      onChange={onChange}
                    />
                    <OptionsCheckbox
                      value={value}
                      label="usage"
                      onChange={onChange}
                    />
                  </Checkbox.Group>
                )}
              />
            </HStack>
            <Text
              fontFamily={'heading'}
              fontSize={'sm'}
              color={'gray.200'}
              mt={8}
            >
              Aceita troca?
            </Text>

            <Controller
              control={control}
              name="accept_trade"
              render={({ field: { onChange, value } }) => (
                <Switch
                  size="md"
                  mt={2}
                  offTrackColor={'gray.500'}
                  onTrackColor="lightBlue.100"
                  onToggle={onChange}
                  value={value}
                  isChecked={value}
                />
              )}
            />

            <Text
              fontFamily={'heading'}
              fontSize={'sm'}
              color={'gray.200'}
              mt={8}
            >
              Meios de pagamento aceitos
            </Text>

            <Controller
              control={control}
              name="payment_methods"
              defaultValue={payment_methods}
              render={({ field: { onChange, value } }) => (
                <PaymentsMethodsCheckbox
                  onChange={onChange}
                  defaultValue={payment_methods}
                  value={value || []}
                />
              )}
            />

            <HStack justifyContent={'space-between'} mt={8}>
              <Button
                text="Resetar filtros"
                colorText="gray.200"
                bgColor={'gray.500'}
                maxW={'48%'}
                onPress={handleClearFilters}
              />
              <Button
                text="Aplicar filtros"
                colorText="gray.700"
                bgColor={'gray.100'}
                maxW={'48%'}
                onPress={handleSubmit(handleFilter)}
              />
            </HStack>
          </Box>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}
