import {ReactNode} from 'react';
import Footer from '~/components/global/Footer';
import Header from '~/components/global/Header';
import type {SanityMenuLink} from '~/types';

type Props = {
  backgroundColor?: string;
  clean?: boolean;
  children?: ReactNode;
  menuLinks?: SanityMenuLink[];
};

export default function Layout({
  backgroundColor,
  clean,
  children,
  menuLinks = [],
}: Props) {
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
