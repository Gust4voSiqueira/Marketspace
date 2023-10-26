import { Box, HStack, Image, Pressable, Skeleton, useToast } from 'native-base'
import { Plus, X } from 'phosphor-react-native'

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import React, { useState } from 'react'

interface IImages {
  quantitieImagesSelected: number
  handleAddImage: (image: ImagePicker.ImagePickerAsset) => void
  // handleRemoveImage: (imageRemoved: ImagePicker.ImagePickerAsset) => void
  children: React.ReactNode
}

export function ImagesInput({
  quantitieImagesSelected,
  handleAddImage,
  // handleRemoveImage,
  children,
}: IImages) {
  const [selectingImage, setSelectingImage] = useState(false)
  const toast = useToast()

  async function handleUserPhotoSelect() {
    try {
      setSelectingImage(true)
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
        base64: true,
      })

      if (photoSelected.canceled) return

      if (photoSelected.assets[0].uri) {
        const photoInfo = (await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri,
        )) as any

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: 'Essa imagem é muito grande. escolha uma de até 5MB.',
            placement: 'top',
            bgColor: 'red.500',
          })
        }

        const photo = photoSelected.assets[0]

        handleAddImage(photo)
      }
    } catch (error) {
      toast.show({
        title: 'Falha ao selecionar imagem.',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setSelectingImage(false)
    }
  }

  return (
    <HStack flex={1} height={100} mb={8}>
      {children}
      {/* {imagesSelected.map((image) => (
        <Box key={image.base64} position={'relative'} w={100} h={100} mr={2}>
          <Image
            source={{ uri: image.uri }}
            flex={1}
            borderRadius={'md'}
            alt=""
          />

          <Pressable
            position={'absolute'}
            borderRadius={'full'}
            bgColor={'gray.200'}
            justifyContent={'center'}
            alignItems={'center'}
            w={4}
            h={4}
            right={1}
            top={1}
            onPress={() => handleRemoveImage(image)}
          >
            <X color="#F7F7F8" size={14} />
          </Pressable>
        </Box>
      ))} */}

      {selectingImage && (
        <Skeleton
          w={100}
          h={100}
          mr={2}
          startColor={'gray.400'}
          endColor={'gray.500'}
          borderRadius={'md'}
        />
      )}

      {quantitieImagesSelected < 3 && (
        <Pressable
          w={100}
          height={100}
          mb={4}
          bgColor={'gray.500'}
          justifyContent={'center'}
          alignItems={'center'}
          mr={2}
          borderRadius={'md'}
          onPress={handleUserPhotoSelect}
        >
          <Plus color="#9F9BA1" weight="bold" />
        </Pressable>
      )}
    </HStack>
  )
}
