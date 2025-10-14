import S from '@sanity/desk-tool/structure-builder';
import { DocumentsIcon } from '@sanity/icons';

// prettier-ignore
export const articles = S.listItem()
  .title('Articles')
  .icon(DocumentsIcon)
  .schemaType('article')
  .child(
    S.documentTypeList('article')
  )
