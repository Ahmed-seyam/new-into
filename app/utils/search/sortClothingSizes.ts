// sortClothingSizes.ts
export const sortClothingSizes = (a: any, b: any) => {
  const ORDER = ['os', 'xxs', 'xs', 's', 'm', 'l', 'xl', '2xl', 'xxl'];

  const aLower = a.name.toLowerCase();
  const bLower = b.name.toLowerCase();

  let nra = parseInt(aLower);
  let nrb = parseInt(bLower);

  if (ORDER.indexOf(aLower) !== -1) nra = NaN;
  if (ORDER.indexOf(bLower) !== -1) nrb = NaN;

  if (nrb === 0) return 1;
  if ((nra && !nrb) || nra === 0) return -1;
  if (!nra && nrb) return 1;
  if (nra && nrb) {
    if (nra === nrb) {
      return aLower
        .substring(('' + nra).length)
        .localeCompare(bLower.substring(('' + nrb).length));
    } else {
      return nra - nrb;
    }
  } else {
    return ORDER.indexOf(aLower) - ORDER.indexOf(bLower);
  }
};