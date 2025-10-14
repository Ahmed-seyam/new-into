export const sortShoeSizes = (a, b) => {
  const shoeSizeA = parseInt(a.name) || 0;
  const shoeSizeB = parseInt(b.name) || 0;

  return shoeSizeA - shoeSizeB;
};
