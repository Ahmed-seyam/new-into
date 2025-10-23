import { CopyIcon } from '@sanity/icons'
import React from 'react'
import ShopifyIcon from '../../components/icons/Shopify'
import ProductVariantHiddenInput from '../../components/inputs/ProductVariantHidden'
import ShopifyDocumentStatus from '../../components/media/ShopifyDocumentStatus'

export default {
  // Hide 'create new' button in desk structure
  __experimental_actions: [/*'create',*/ 'update', /*'delete',*/ 'publish'],
  name: 'productVariant',
  title: 'Product variant',
  type: 'document',
  icon: CopyIcon,
  groups: [
    {
      name: 'shopifySync',
      title: 'Shopify sync',
      icon: ShopifyIcon,
    },
  ],
  fields: [
    {
      name: 'hidden',
      type: 'string',
      component: ProductVariantHiddenInput,
      hidden: ({ parent }: { parent?: any }) => {
        const isDeleted = parent?.store?.isDeleted
        return !isDeleted
      },
    },
    {
      title: 'Title',
      name: 'titleProxy',
      type: 'proxyString',
      options: { field: 'store.title' },
    },
    {
      name: 'store',
      title: 'Shopify',
      description: 'Variant data from Shopify (read-only)',
      type: 'shopifyProductVariant',
      group: 'shopifySync',
    },
  ],
  preview: {
    select: {
      isDeleted: 'store.isDeleted',
      previewImageUrl: 'store.previewImageUrl',
      sku: 'store.sku',
      status: 'store.status',
      title: 'store.title',
    },
    prepare(selection: {
      isDeleted?: boolean
      previewImageUrl?: string
      sku?: string
      status?: string
      title?: string
    }) {
      const { isDeleted, previewImageUrl, sku, status, title } = selection

      return {
        media: (
          <ShopifyDocumentStatus
            isActive={status === 'active'}
            isDeleted={isDeleted}
            type="productVariant"
            url={previewImageUrl}
          />
        ),
        subtitle: sku,
        title,
      }
    },
  },
}
