import clsx from 'clsx';
import { Suspense } from 'react';

import { CacheNone, HydrogenRouteProps, Seo, type } from '@shopify/hydrogen';

import RecoverPasswordForm from '../../components/account/forms/RecoverPassword.client';
import Layout from '../../components/global/Layout.server';

/**
 * A form for the user to fill out to _initiate_ a password reset.
 * If the form succeeds, an email will be sent to the user with a link
 * to reset their password. Clicking the link leads the user to the
 * page `/account/reset/[resetToken]`.
 */
export default function AccountRecover({response}: HydrogenRouteProps) {
  response.cache(CacheNone());

  return (
    <Layout>
      <Suspense>
        <Seo type="noindex" data={{title: 'Recover password'}} />
      </Suspense>
      <div>
        <RecoverPasswordForm />
      </div>
    </Layout>
  );
}
