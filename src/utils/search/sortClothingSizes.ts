export const sortClothingSizes = (a, b) => {
  const ORDER = ['os', 'xxs', 'xs', 's', 'm', 'l', 'xl', '2xl', 'xxl'];

  a = a.name.toLowerCase();
  b = b.name.toLowerCase();

  let nra = parseInt(a);
  let nrb = parseInt(b);

  if (ORDER.indexOf(a) != -1) nra = NaN;
  if (ORDER.indexOf(b) != -1) nrb = NaN;

  if (nrb === 0) return 1;
  if ((nra && !nrb) || nra === 0) return -1;
  if (!nra && nrb) return 1;
  if (nra && nrb) {
    if (nra == nrb) {
      return a
        .substr(('' + nra).length)
        .localeCompare(a.substr(('' + nra).length));
    } else {
      return nra - nrb;
    }
  } else {
    return ORDER.indexOf(a) - ORDER.indexOf(b);
  }

  return result;
};
