/**
 * Desk structure configuration for Sanity Studio v4
 *
 * This file configures how documents are structured in the Studio's desk tool.
 * It customizes the navigation by creating singleton documents (home, settings)
 * and organizing products with their variants for better editorial access.
 */

import { collections } from './desk/collections'
import { colorThemes } from './desk/colorThemes'
import { home } from './desk/home'
import { articles } from './desk/articles'
import { blogs } from './desk/blogs'
import { pages } from './desk/pages'
import { products } from './desk/products'
import { settings } from './desk/settings'

// Document types that are manually added to the structure
// These will be excluded from the automatic list to prevent duplicates
const DOCUMENT_TYPES_IN_STRUCTURE = [
  'collection',
  'colorTheme',
  'home',
  'media.tag',
  'article',
  'blog',
  'page',
  'product',
  'productVariant',
  'settings',
]

export default (S) =>
  S.list()
    .title('Content')
    .items([
      home(S),
      articles(S),
      blogs(S),
      pages(S),
      S.divider(),
      collections(S),
      products(S),
      S.divider(),
      colorThemes(S),
      S.divider(),
      settings(S),
      S.divider(),
      // Automatically add new document types to the root pane
      // Filter out the ones we've manually configured above
      ...S.documentTypeListItems().filter(
        (listItem) => !DOCUMENT_TYPES_IN_STRUCTURE.includes(listItem.getId() || '')
      ),
    ])