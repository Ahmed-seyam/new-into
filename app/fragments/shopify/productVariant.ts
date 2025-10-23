export const PRODUCT_VARIANT_FIELDS = `#graphql
  fragment ProductVariantFields on ProductVariant {
    availableForSale
    compareAtPriceV2 {
      currencyCode
      amount
    }
    id
    image {
      altText
      height
      id
      url
      width
    }
    priceV2 {
      currencyCode
      amount
    }
    selectedOptions {
      name
      value
    }
    title
  }
`;
