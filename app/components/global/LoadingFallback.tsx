import LogoIcon from '../icons/Logo';

/**
 * A shared component and Suspense call that's used in `App.server.jsx` to let your app wait for code to load while declaring a loading state
 */
export default function LoadingFallback() {
  return (
    <header className="container relative">
      <div className="top-0 py-3 md:absolute md:left-1/2 md:-translate-x-1/2 md:transform">
        <LogoIcon />
      </div>
    </header>
  );
}
