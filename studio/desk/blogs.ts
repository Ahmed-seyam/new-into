import { StructureBuilder } from 'sanity/structure'

export const blogs = (S: StructureBuilder) =>
  S.listItem()
    .title('Blogs')
    .schemaType('blog')
    .child(
      S.documentTypeList('blog')
        .title('Blogs')
    )