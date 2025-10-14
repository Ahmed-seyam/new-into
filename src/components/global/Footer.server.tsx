import type {Block} from '@sanity/types';
import groq from 'groq';

import {Link} from '@shopify/hydrogen';

import {LINKS} from '../../fragments/sanity/links';
import {PORTABLE_TEXT} from '../../fragments/sanity/portableText/portableText';
import useSanityQuery from '../../hooks/useSanityQuery';
import LogoIcon from '../icons/Logo';
import PortableText from '../portableText/PortableText.server';
import FooterGradient from './FooterGradient.client';

import type {SanityLink} from '../../types';
/**
 * A server component that specifies the content of the footer on the website
 */

function CollectionNav({links}) {
  let title;

  // http://localhost:3000/collections/all?refinementList%5Bvendor%5D%5B0%5D=Loewe
  // http://localhost:3000/collections/all?refinementList%5Bvendor%5D%5B0%5D%3DLoewe
  return (
    <nav className="collection-nav-list">
      {links?.map((link) => {
        const title = link.title.replace(' - All', '');
        const url = `${title.toLowerCase().replace(/ /g, '-')}-all`;

        return (
          <a href={`/collections/${url}`} data-to={url}>
            {title}
          </a>
        );
      })}
    </nav>
  );
}
export default function Footer() {
  const {data: footer} = useSanityQuery<{
    links?: SanityLink[];
    text?: Block[];
  }>({query: QUERY_SANITY});

  const renderLinks = footer?.footer?.links?.map((link) => {
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
      if (!link.slug) {
        return null;
      }

      return (
        <Link key={link._key} to={link.slug}>
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
        <div>{footer?.text && <PortableText blocks={footer.text} />}</div>
        <LogoIcon width="100%" />
        <div className="order-first mt-10 flex justify-between md:order-last md:mt-0">
          <div className="flex w-full flex-col gap-2 md:flex-row md:justify-between md:gap-0">
            {renderLinks}
          </div>
        </div>
      </div>
      {/* <SanityFooter /> */}
      <FooterGradient />
    </div>
  );
}
const QUERY_SANITY = groq`{
  "footer": *[_type == 'settings'][0].footer {
    links[] {
      ${LINKS}
    },
    text[]{
      ${PORTABLE_TEXT}
    },
  },
  "collections": *[_type=="collection" && store.title match "* - All" && store.title != "All" && (store.title match "*Rentals*" == false)]{
  "title": store.title
}
}
`;
