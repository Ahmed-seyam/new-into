import { TagIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'
import pluralize from 'pluralize'
import React from 'react'
import ShopifyDocumentStatus from '../../components/media/ShopifyDocumentStatus'
import { SANITY_API_VERSION } from '../../constants'
import { getPriceRange } from '../../utils/getPriceRange'
import { client } from '../../lib/client'

export default defineType({
  name: 'productWithVariant',
  title: 'Product with variant',
  type: 'object',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'product',
      type: 'reference',
      to: [{ type: 'product' }],
      weak: true,
    }),
    defineField({
      name: 'variant',
      type: 'reference',
      to: [{ type: 'productVariant' }],
      weak: true,
      description: 'First variant will be selected if left empty',
      options: {
        filter: ({ parent }: any) => {
          const productId = parent?.product?._ref
          if (!productId) return undefined

          return {
            filter: `_id in *[_id == $productId][0].store.variants[]._ref`,
            params: { productId },
          }
        },
      },
      hidden: ({ parent }) => !parent?.product,
      validation: (Rule) =>
        Rule.custom(async (value, { parent }: any) => {
          const productId = parent?.product?._ref
          const productVariantId = value?._ref

          if (!productId || !productVariantId) return true

          const result = await client
            .withConfig({ apiVersion: SANITY_API_VERSION })
            .fetch(
              `*[_id == $productId && references($productVariantId)][0]._id`,
              { productId, productVariantId }
            )

          return result ? true : 'Invalid product variant'
        }),
    }),
  ],
  preview: {
    select: {
      defaultVariantTitle: 'product.store.variants.0.store.title',
      isDeleted: 'product.store.isDeleted',
      optionCount: 'product.store.options.length',
      previewImageUrl: 'product.store.previewImageUrl',
      priceRange: 'product.store.priceRange',
      status: 'product.store.status',
      title: 'product.store.title',
      variantCount: 'product.store.variants.length',
      variantPreviewImageUrl: 'variant.store.previewImageUrl',
      variantTitle: 'variant.store.title',
    },
    prepare(selection) {
      const {
        defaultVariantTitle,
        isDeleted,
        optionCount,
        previewImageUrl,
        priceRange,
        status,
        title,
        variantCount,
        variantPreviewImageUrl,
        variantTitle,
      } = selection

      const productVariantTitle = variantTitle || defaultVariantTitle

      const previewTitle = [title]
      if (productVariantTitle) previewTitle.push(`[${productVariantTitle}]`)

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
            url={variantPreviewImageUrl || previewImageUrl}
          />
        ),
        description: description.join(' / '),
        subtitle,
        title: previewTitle.join(' '),
      }
    },
  },
})
