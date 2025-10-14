import S from '@sanity/desk-tool/structure-builder';

// prettier-ignore
export const blogs = S.listItem()
  .title('Blogs')
  .schemaType('blog')
  .child(
    S.documentTypeList('blog')
  )
