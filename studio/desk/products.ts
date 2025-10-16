import { InfoOutlineIcon } from '@sanity/icons'
import { StructureBuilder } from 'sanity/structure'

export const products = (S: StructureBuilder) =>
  S.listItem()
    .title('Products')
    .schemaType('product')
    .child(
      S.documentTypeList('product')
        .child((id) =>
          S.list()
            .title('Product')
            .items([
              // Details
              S.listItem()
                .title('Details')
                .icon(InfoOutlineIcon)
                .child(
                  S.document()
                    .schemaType('product')
                    .documentId(id)
                ),
              // Product variants
              S.listItem()
                .title('Variants')
                .child(
                  S.documentList()
                    .title('Variants')
                    .schemaType('productVariant')
                    .filter('_type == "productVariant" && store.productId == $productId')
                    .params({
                      productId: Number(id.replace('shopifyProduct-', '')),
                    })
                ),
            ])
        )
    )