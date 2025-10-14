import groq from 'groq';
import {ReactNode} from 'react';

import {LINKS} from '../../fragments/sanity/links';
import useSanityQuery from '../../hooks/useSanityQuery';

import Footer from './Footer.server';
import Header from './Header.server';

import type {SanityMenuLink} from '../../types';
/**
 * A server component that defines a structure and organization of a page that can be used in different parts of the Hydrogen app
 */

type Props = {
  backgroundColor?: string;
  clean?: boolean;
  children?: ReactNode;
};

export default function Layout({backgroundColor, clean, children}: Props) {
  const {data: menuLinks} = useSanityQuery<SanityMenuLink[]>({
    query: QUERY_SANITY,
  });

  return (
    <>
      <Header menuLinks={menuLinks} />
      <div
        className={!clean ? `container min-h-screen pt-12` : `pt-12`}
        id="mainContent"
        role="main"
      >
        {children}
      </div>
      <Footer />
    </>
  );
}

const QUERY_SANITY = groq`
  *[_type == 'settings'][0].menu.links[] {
    ${LINKS}
  }
`;
