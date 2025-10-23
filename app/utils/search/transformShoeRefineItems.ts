// transformShoeRefineItems.ts
export const transformShoeRefineItems = (items: any[]) => {
  const result = items.filter(function (element) {
    return (
      !element.value.includes('X') &&
      !element.value.includes('M') &&
      !element.value.includes('S') &&
      !element.value.includes('L')
    );
  });

  return result.map((item) => ({
    ...item,
    label: item.label.toUpperCase(),
  }));
};