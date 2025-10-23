/**
 * Custom document action compatible with Sanity v4
 */
import { TrashIcon } from '@sanity/icons'
import { Stack, Text, useToast } from '@sanity/ui'
import React, { useState } from 'react'
import { client } from '../lib/client'

type Props = {
  draft?: Record<string, any> // Sanity Document
  onComplete: () => void
  published?: Record<string, any> // Sanity Document
  type: string
}

const deleteCollection = (props: Props) => {
  const { draft, onComplete, published } = props
  const [dialogOpen, setDialogOpen] = useState(false)
  const toast = useToast()

  return {
    color: 'danger',
    dialog: dialogOpen && {
      type: 'confirm',
      color: 'danger',
      title: 'Delete current collection?',
      message: (
        <Stack space={4}>
          <Text>Delete the current collection in your dataset.</Text>
          <Text weight="medium">No content on Shopify will be deleted.</Text>
        </Stack>
      ),
      onCancel: onComplete,
      onConfirm: async () => {
        const transaction = client.transaction()
        if (published?._id) transaction.delete(published._id)
        if (draft?._id) transaction.delete(draft._id)

        try {
          await transaction.commit()
          window.location.href  = '/desk/collections'
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

export default deleteCollection
