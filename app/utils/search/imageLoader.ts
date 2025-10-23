// imageLoader.ts
export const imageLoader = ({src}: {src: string}) => {
  return `${src}?w=352&h=466 352w, ${src}?w=832&h=1101 832w`;
};