/**
 * Custom document action compatible with Sanity v4
 */
import { TrashIcon } from '@sanity/icons'
import { Stack, Text, useToast } from '@sanity/ui'
import React, { useState } from 'react'
import { SANITY_API_VERSION } from '../constants'
import { client } from '../lib/client'

type Props = {
  draft?: Record<string, any>
  onComplete: () => void
  published?: Record<string, any>
  type: string
}

const deleteProductAndVariants = (props: Props) => {
  const { draft, onComplete, published } = props
  const [dialogOpen, setDialogOpen] = useState(false)

  const toast = useToast()

  return {
    color: 'danger',
    dialog: dialogOpen && {
      type: 'confirm',
      color: 'danger',
      title: 'Delete current product and associated variants?',
      message: (
        <Stack space={4}>
          <Text>Delete the current product and all associated variants in your dataset.</Text>
          <Text weight="medium">No content on Shopify will be deleted.</Text>
        </Stack>
      ),
      onCancel: onComplete,
      onConfirm: async () => {
        const productId = published?.store?.id

        // Fetch product variant IDs
        let productVariantIds: string[] = []
        if (productId) {
          productVariantIds = await client
            .withConfig({ apiVersion: SANITY_API_VERSION })
            .fetch(
              `*[ _type == "productVariant" && store.productId == $productId ]._id`,
              { productId }
            )
        }

        // Prepare transaction
        const transaction = client.transaction()
        if (published?._id) transaction.delete(published._id)
        if (draft?._id) transaction.delete(draft._id)

        // Delete all product variants including drafts
        productVariantIds.forEach(id => {
          transaction.delete(id)
          transaction.delete(`drafts.${id}`)
        })

        try {
          await transaction.commit()
          window.location.href  = '/desk/products'
        } catch (err: any) {
          toast.push({
            status: 'error',
            title: err?.message || 'Something went wrong'
          })
        } finally {
          onComplete()
        }
      }
    },
    icon: TrashIcon,
    label: 'Delete',
    onHandle: () => setDialogOpen(true),
    shortcut: 'Ctrl+Alt+D'
  }
}

export default deleteProductAndVariants
