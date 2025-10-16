import { DocumentsIcon } from '@sanity/icons'
import { StructureBuilder } from 'sanity/structure'

export const pages = (S: StructureBuilder) =>
  S.listItem()
    .title('Pages')
    .icon(DocumentsIcon)
    .schemaType('page')
    .child(
      S.documentTypeList('page')
        .title('Pages')
    )