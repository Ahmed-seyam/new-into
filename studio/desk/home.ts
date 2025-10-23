import { StructureBuilder } from 'sanity/structure'

export const home = (S: StructureBuilder) =>
  S.listItem()
    .title('Home')
    .schemaType('home')
    .child(
      S.document()
        .schemaType('home')
        .documentId('home')
        .title('Home')
    )