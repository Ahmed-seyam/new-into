import { SanityDocument } from '@sanity/client'
import { WarningOutlineIcon } from '@sanity/icons'
import { Box, Card, Flex, Stack, Text } from '@sanity/ui'
import React, { forwardRef } from 'react'
import { collectionUrl } from '../../utils/shopifyUrls'
import { ObjectInputProps  } from 'sanity'

type Props = ObjectInputProps & {
  value?: any
}

const CollectionHiddenInput = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { value } = props
  // Access document from renderDefault props or context
  const document = (props as any).document as SanityDocument

  const shopifyCollectionUrl = collectionUrl(document?.store?.id)
  const isDeleted = document?.store?.isDeleted

  return (
    <Card padding={4} radius={2} ref={ref} shadow={1} tone="critical">
      <Flex align="flex-start">
        <Text size={2}>
          <WarningOutlineIcon />
        </Text>
        <Box flex={1} marginLeft={3}>
          <Box>
            <Text size={2} weight="semibold">
              This collection is hidden
            </Text>
          </Box>
          <Stack marginTop={4} space={2}>
            <Text size={1}>It has been deleted from Shopify.</Text>
          </Stack>
          {!isDeleted && shopifyCollectionUrl && (
            <Box marginTop={4}>
              <Text size={1}>
                →{' '}
                <a href={shopifyCollectionUrl} target="_blank" rel="noopener noreferrer">
                  View this collection on Shopify
                </a>
              </Text>
            </Box>
          )}
        </Box>
      </Flex>
    </Card>
  )
})

CollectionHiddenInput.displayName = 'CollectionHiddenInput'

export default CollectionHiddenInput