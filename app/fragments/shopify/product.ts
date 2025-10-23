export const PRODUCT_FIELDS = `#graphql
  fragment ProductFields on Product {
    handle
    id
    descriptionHtml
    options {
      name
      values
    }
    title
    vendor
    productType
    createdAt
    era: metafield(namespace: "product", key: "era") {
      value
    }
    condition: metafield(namespace: "product", key: "condition") {
      value
    }
  }
`;
