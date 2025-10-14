export function getBlendMode(product) {
  if (product.createdAt) {
    if (
      Date.parse(product.createdAt) < Date.parse('2023-01-09T15:40:14.000Z')
    ) {
      return 'multiply';
    } else {
      return 'normal';
    }
  } else if (product.created_at) {
    if (
      Date.parse(product.created_at) < Date.parse('2023-01-09T15:40:14.000Z')
    ) {
      return 'multiply';
    } else {
      return 'normal';
    }
  } else {
    return 'normal';
  }
}
