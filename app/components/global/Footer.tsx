import {Link, useRouteLoaderData} from 'react-router';
import LogoIcon from '~/components/icons/Logo';
import type {SanityLink} from '~/types';
import PortableText from '../portableText/PortableText';
import FooterGradient from './FooterGradient';

function CollectionNav({links}: {links: Array<{title: string}>}) {
  return (
    <nav className="collection-nav-list">
      {links?.map((link) => {
        const title = link.title.replace(' - All', '');
        const url = `${title.toLowerCase().replace(/ /g, '-')}-all`;
        return (
          <a key={url} href={`/collections/${url}`} data-to={url}>
            {title}
          </a>
        );
      })}
    </nav>
  );
}

export default function Footer() {
  const rootData = useRouteLoaderData<any>('root');
  const footer = rootData?.sanityData?.footer || {};

  const renderLinks = footer?.footer?.links?.map((link: SanityLink) => {
    if (link._type === 'linkExternal') {
      return (
        <a
          key={link._key}
          href={link.url}
          rel="noreferrer"
          target={link.newWindow ? '_blank' : '_self'}
        >
          {link.title}
        </a>
      );
    }
    if (link._type === 'linkInternal') {
      if (!link.slug) return null;
      return (
        <Link key={link._key} to={link.slug} prefetch="intent">
          {link.title}
        </Link>
      );
    }
    return null;
  });

  return (
    <div className="container relative pb-6 pt-24" role="contentinfo">
      {footer.collections && (
        <div className="relative z-10">
          <CollectionNav links={footer.collections} />
        </div>
      )}
      <div className="relative z-10 flex flex-col justify-center gap-6">
        <div>
          {footer?.footer?.text && <PortableText blocks={footer.footer.text} />}
        </div>
        <LogoIcon width="100%" />
        <div className="order-first mt-10 flex justify-between md:order-last md:mt-0">
          <div className="flex w-full flex-col gap-2 md:flex-row md:justify-between md:gap-0">
            {renderLinks}
          </div>
        </div>
      </div>
      <FooterGradient />
    </div>
  );
}
