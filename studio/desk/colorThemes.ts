import { StructureBuilder } from 'sanity/structure'

export const colorThemes = (S: StructureBuilder) =>
  S.listItem()
    .title('Color themes')
    .schemaType('colorTheme')
    .child(
      S.documentTypeList('colorTheme')
        .title('Color Themes')
    )