import { DocumentsIcon } from '@sanity/icons'
import { StructureBuilder } from 'sanity/structure'

export const articles = (S: StructureBuilder) =>
  S.listItem()
    .title('Articles')
    .icon(DocumentsIcon)
    .schemaType('article')
    .child(
      S.documentTypeList('article')
        .title('Articles')
    )