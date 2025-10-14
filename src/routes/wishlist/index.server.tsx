import Layout from '../../components/global/Layout.server';
import Wishlist from '../../components/wishlist/Wishlist.server';

export default function WishlistRoute() {
  return (
    <Layout>
      Wishlist:
      <Wishlist />
    </Layout>
  );
}
