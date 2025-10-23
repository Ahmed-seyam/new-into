/**
 * Custom document action for Sanity v4
 *
 * Opens the corresponding Shopify URL for a collection, product, or product variant.
 */
import { EarthGlobeIcon } from '@sanity/icons'
import { collectionUrl, productUrl, productVariantUrl } from '../utils/shopifyUrls'

type Props = {
  published: Record<string, any> // Sanity Document
  type: string
}

export default (props: Props) => {
  const { published, type } = props

  const isShopifyDocument = ['collection', 'product', 'productVariant'].includes(type)

  // Hide action if:
  // - No published document
  // - Document type is not Shopify-related
  // - Document has been deleted from Shopify
  if (!published || !isShopifyDocument || published?.store?.isDeleted) {
    return null
  }

  let url: string | undefined
  if (type === 'collection') {
    url = collectionUrl(published?.store?.id)
  } else if (type === 'product') {
    url = productUrl(published?.store?.id)
  } else if (type === 'productVariant') {
    url = productVariantUrl(published?.store?.productId, published?.store?.id)
  }

  if (!url) {
    return null
  }

  return {
    label: 'Edit in Shopify',
    icon: EarthGlobeIcon,
    onHandle: () => {
      window.open(url)
    },
    shortcut: 'Ctrl+Alt+E'
  }
}
