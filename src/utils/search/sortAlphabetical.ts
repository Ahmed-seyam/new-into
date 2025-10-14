export const sortAlphabetical = (
  a: Record<string, any>,
  b: Record<string, any>,
) => {
  const aName = a.name.toLowerCase();
  const bName = b.name.toLowerCase();

  return aName.localeCompare(bName);
};
