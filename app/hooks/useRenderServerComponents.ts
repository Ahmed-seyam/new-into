import { useRevalidator } from 'react-router';

/**
 * Triggers a server revalidation of the current route.
 * Works as replacement for old `useRenderServerComponents`.
 */
export default function useRenderServerComponents() {
  const revalidator = useRevalidator();

  return revalidator.revalidate;
}
