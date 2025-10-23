import {useState, useEffect} from 'react';

export default function Wishlist() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const addToWishlist = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'https://prod-api.wishlist.plutocracy.io/api/wishlist/event/c57f7a46-2405-42b0-9907-036fa25b96ee',
        {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({
            eventType: 'wishlist/add',
            event: {
              id: 'gid://shopify/Product/7803341144276',
              productObject: {
                productId: 'gid://shopify/Product/7803341144276',
                productHandle: 'alaia-90s-black-knit-dress',
                price: 0,
              },
              anything:
                'put whatever you want here. Set arbitrary property names, any values',
              priceInstructions:
                'To include the price in wishlist analytics, include the price in cents',
            },
            meta: {
              anything:
                'put whatever you want here. Set arbitrary property names, any values',
            },
          }),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuccess(true);
      console.log('Added to wishlist:', data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to add to wishlist',
      );
      console.error('Error adding to wishlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return <h2>✓ Added to wishlist</h2>;
  }

  return (
    <div>
      <button onClick={() => addToWishlist} disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add to Wishlist'}
      </button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}
