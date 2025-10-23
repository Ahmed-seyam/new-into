import {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import type {Cart, CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import {client} from '~/lib/storfrontFetch';

type CartContextType = {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (line: CartLineInput) => Promise<void>;
  updateCartLine: (lineId: string, quantity: number) => Promise<void>;
  removeCartLine: (lineId: string) => Promise<void>;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

type Props = {
  children: ReactNode;
};

export function CartProvider({children}: Props) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
      void fetchCart(cartId);
    }
  }, []);

  const fetchCart = async (cartId: string) => {
    try {
      const res = await fetch(client.getStorefrontApiUrl(), {
        method: 'POST',
        headers: client.getPublicTokenHeaders(),
        body: JSON.stringify({
          query: CART_QUERY,
          variables: {cartId},
        }),
      });

      const json: any = await res.json();
      if (json.data?.cart) {
        setCart(json.data.cart);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const createCart = async (lines: CartLineInput[]) => {
    setIsLoading(true);
    try {
      const res = await fetch(client.getStorefrontApiUrl(), {
        method: 'POST',
        headers: client.getPublicTokenHeaders(),
        body: JSON.stringify({
          query: CREATE_CART_MUTATION,
          variables: {lines},
        }),
      });

      const json: any = await res.json();
      const newCart = json.data?.cartCreate?.cart;

      if (newCart) {
        setCart(newCart);
        localStorage.setItem('cartId', newCart.id);
      }
    } catch (err) {
      console.error('Error creating cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (line: CartLineInput) => {
    setIsLoading(true);
    try {
      if (!cart?.id) {
        await createCart([line]);
      } else {
        const res = await fetch(client.getStorefrontApiUrl(), {
          method: 'POST',
          headers: client.getPublicTokenHeaders(),
          body: JSON.stringify({
            query: ADD_TO_CART_MUTATION,
            variables: {
              cartId: cart.id,
              lines: [line],
            },
          }),
        });

        const json: any = await res.json();
        const updatedCart = json.data?.cartLinesAdd?.cart;

        if (updatedCart) {
          setCart(updatedCart);
        }
      }
      setCartOpen(true);
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartLine = async (lineId: string, quantity: number) => {
    if (!cart?.id) return;

    setIsLoading(true);
    try {
      const res = await fetch(client.getStorefrontApiUrl(), {
        method: 'POST',
        headers: client.getPublicTokenHeaders(),
        body: JSON.stringify({
          query: UPDATE_CART_LINE_MUTATION,
          variables: {
            cartId: cart.id,
            lines: [{id: lineId, quantity}],
          },
        }),
      });

      const json: any = await res.json();
      const updatedCart = json.data?.cartLinesUpdate?.cart;

      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (err) {
      console.error('Error updating cart line:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeCartLine = async (lineId: string) => {
    if (!cart?.id) return;

    setIsLoading(true);
    try {
      const res = await fetch(client.getStorefrontApiUrl(), {
        method: 'POST',
        headers: client.getPublicTokenHeaders(),
        body: JSON.stringify({
          query: REMOVE_CART_LINE_MUTATION,
          variables: {
            cartId: cart.id,
            lineIds: [lineId],
          },
        }),
      });

      const json: any = await res.json();
      const updatedCart = json.data?.cartLinesRemove?.cart;

      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (err) {
      console.error('Error removing cart line:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const value = {
    cart,
    isLoading,
    addToCart,
    updateCartLine,
    removeCartLine,
    cartOpen,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            priceV2 {
              amount
              currencyCode
            }
            product {
              id
              title
              handle
              featuredImage {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
`;

const CART_QUERY = /* GraphQL */ `
  ${CART_FRAGMENT}
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
`;

const CREATE_CART_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CreateCart($lines: [CartLineInput!]!) {
    cartCreate(input: {lines: $lines}) {
      cart {
        ...CartFragment
      }
    }
  }
`;

const ADD_TO_CART_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
    }
  }
`;

const UPDATE_CART_LINE_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
    }
  }
`;

const REMOVE_CART_LINE_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation RemoveCartLine($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
    }
  }
`;
