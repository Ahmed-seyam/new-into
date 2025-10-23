
// export default [
//   // Use default templates, but filter out certain document types/IDs
//   ...S.defaultInitialValueTemplateItems().filter(template => {
//     const { spec } = template
//     return ![
//       ...LOCKED_DOCUMENT_IDS,
//       ...LOCKED_DOCUMENT_TYPES
//     ].includes(spec.id)
//   })
// ]
// parts/newDocumentStructure.js
import { LOCKED_DOCUMENT_TYPES, LOCKED_DOCUMENT_IDS } from '../constants';

/**
 * Return an array of initial value templates
 * In v4, you can use a function to filter or modify templates.
 */
export default function resolveInitialValueTemplates({ schema }) {
  const templates = schema.getInitialValueTemplates(); // v4 helper to get all templates

  return templates.filter(template => {
    const { spec } = template;
    return ![...LOCKED_DOCUMENT_IDS, ...LOCKED_DOCUMENT_TYPES].includes(spec.id);
  });
}
