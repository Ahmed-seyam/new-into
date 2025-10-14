import clsx from 'clsx';
import { Suspense } from 'react';

import { CacheNone, HydrogenRouteProps, Seo, type } from '@shopify/hydrogen';

import LoginForm from '../../components/account/forms/Login.client';
import Layout from '../../components/global/Layout.server';

export default function Login({response}: HydrogenRouteProps) {
  response.cache(CacheNone());

  return (
    <Layout>
      <Suspense>
        <Seo type="noindex" data={{title: 'Login'}} />
      </Suspense>

      <LoginForm />
    </Layout>
  );
}
