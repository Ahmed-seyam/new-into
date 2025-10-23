import { TagIcon } from '@sanity/icons'
import pluralize from 'pluralize'
import React from 'react'
import ShopifyIcon from '../../components/icons/Shopify'
import ProductHiddenInput from '../../components/inputs/ProductHidden'
import ShopifyDocumentStatus from '../../components/media/ShopifyDocumentStatus'
import { getPriceRange } from '../../utils/getPriceRange'

const GROUPS = [
  { default: true, name: 'editorial', title: 'Editorial' },
  { name: 'shopifySync', title: 'Shopify sync', icon: ShopifyIcon },
  { name: 'seo', title: 'SEO' },
]

export default {
  __experimental_actions: [/*'create',*/ 'update', /*'delete',*/ 'publish'],
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: TagIcon,
  groups: GROUPS,
  fields: [
    {
      name: 'hidden',
      type: 'string',
      component: ProductHiddenInput,
      group: GROUPS.map(g => g.name),
      hidden: ({ parent }: { parent?: any }) => {
        const isActive = parent?.store?.status === 'active'
        const isDeleted = parent?.store?.isDeleted
        return isActive && !isDeleted
      },
    },
    { name: 'titleProxy', title: 'Title', type: 'proxyString', options: { field: 'store.title' } },
    { name: 'slugProxy', title: 'Slug', type: 'proxyString', options: { field: 'store.slug.current' } },
    { name: 'colorTheme', title: 'Color theme', type: 'reference', to: [{ type: 'colorTheme' }], group: 'editorial' },
    { name: 'body', title: 'Body', type: 'body', group: 'editorial' },
    { name: 'store', title: 'Shopify', type: 'shopifyProduct', description: 'Product data from Shopify (read-only)', group: 'shopifySync' },
    { name: 'seo', title: 'SEO', type: 'seo.shopify', group: 'seo' },
  ],
  orderings: [
    { name: 'titleAsc', title: 'Title (A-Z)', by: [{ field: 'store.title', direction: 'asc' }] },
    { name: 'titleDesc', title: 'Title (Z-A)', by: [{ field: 'store.title', direction: 'desc' }] },
    { name: 'priceDesc', title: 'Price (Highest first)', by: [{ field: 'store.priceRange.minVariantPrice', direction: 'desc' }] },
    { name: 'priceAsc', title: 'Price (Lowest first)', by: [{ field: 'store.priceRange.minVariantPrice', direction: 'asc' }] },
  ],
  preview: {
    select: {
      isDeleted: 'store.isDeleted',
      optionCount: 'store.options.length',
      previewImageUrl: 'store.previewImageUrl',
      priceRange: 'store.priceRange',
      status: 'store.status',
      title: 'store.title',
      variantCount: 'store.variants.length',
    },
    prepare(selection: {
      isDeleted?: boolean
      optionCount?: number
      previewImageUrl?: string
      priceRange?: any
      status?: string
      title?: string
      variantCount?: number
    }) {
      const { isDeleted, optionCount, previewImageUrl, priceRange, status, title, variantCount } = selection

      const description = [
        variantCount ? pluralize('variant', variantCount, true) : 'No variants',
        optionCount ? pluralize('option', optionCount, true) : 'No options',
      ]

      let subtitle = getPriceRange(priceRange)
      if (status !== 'active') subtitle = '(Unavailable in Shopify)'
      if (isDeleted) subtitle = '(Deleted from Shopify)'

      return {
        media: (
          <ShopifyDocumentStatus
            isActive={status === 'active'}
            isDeleted={isDeleted}
            type="product"
            url={previewImageUrl}
          />
        ),
        description: description.join(' / '),
        subtitle,
        title,
      }
    },
  },
}
