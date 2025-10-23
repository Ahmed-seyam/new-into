// sortShoeSizes.ts
export const sortShoeSizes = (a: any, b: any) => {
  const shoeSizeA = parseInt(a.name) || 0;
  const shoeSizeB = parseInt(b.name) || 0;

  return shoeSizeA - shoeSizeB;
};