import { StructureBuilder } from 'sanity/structure'

export const collections = (S: StructureBuilder) =>
  S.listItem()
    .title('Collections')
    .schemaType('collection')
    .child(
      S.documentTypeList('collection')
        .title('Collections')
    )