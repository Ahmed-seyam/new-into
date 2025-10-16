// parts/resolveDocumentActions.js
import { LOCKED_DOCUMENT_IDS, LOCKED_DOCUMENT_TYPES } from '../constants';
import deleteCollection from '../documentActions/deleteCollection';
import deleteProductAndVariants from '../documentActions/deleteProductAndVariants';
import shopifyLink from '../documentActions/shopifyLink';

export default function resolveDocumentActions(prev, context) {
  const { type, id } = context;

  // Filter out actions based on document type and ID
  const filteredActions = prev.filter(action => {
    const actionName = action.action;

    if (
      LOCKED_DOCUMENT_TYPES.includes(type) &&
      ['delete', 'duplicate', 'unpublish'].includes(actionName)
    ) {
      return false;
    }

    if (
      LOCKED_DOCUMENT_IDS.includes(id) &&
      ['delete', 'duplicate', 'unpublish'].includes(actionName)
    ) {
      return false;
    }

    if (type === 'collection' && ['create', 'duplicate'].includes(actionName)) {
      return false;
    }

    if (type === 'product' && ['create', 'duplicate'].includes(actionName)) {
      return false;
    }

    if (type === 'productVariant' && ['create', 'duplicate', 'unpublish'].includes(actionName)) {
      return false;
    }

    return true;
  });

  // Replace specific delete actions with custom handlers
  const modifiedActions = filteredActions.map(action => {
    if (type === 'collection' && action.action === 'delete') {
      return deleteCollection;
    }
    if (type === 'product' && action.action === 'delete') {
      return deleteProductAndVariants;
    }
    return action;
  });

  // Add the shopifyLink action
  return [...modifiedActions, shopifyLink];
}