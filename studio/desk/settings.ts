import { StructureBuilder } from 'sanity/structure'

export const settings = (S: StructureBuilder) =>
  S.listItem()
    .title('Settings')
    .schemaType('settings')
    .child(
      S.document()
        .schemaType('settings')
        .documentId('settings')
        .title('Settings')
    )