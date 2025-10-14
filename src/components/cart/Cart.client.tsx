import clsx from 'clsx';
import {Fragment} from 'react';

// @ts-expect-error incompatibility with node16 resolution
import {Dialog, Transition} from '@headlessui/react';
import {
  CartCheckoutButton,
  CartCost,
  CartLineImage,
  CartLinePrice,
  CartLineProductTitle,
  CartLineQuantity,
  CartLineQuantityAdjustButton,
  CartLines,
  CartShopPayButton,
  Link,
  useCart,
  useCartLine,
} from '@shopify/hydrogen';

import {getBlendMode} from '../../utils/getBlendMode';
import CloseIcon from '../icons/Close';
import MinusCircleIcon from '../icons/MinusCircle';
import PlusCircleIcon from '../icons/PlusCircle';
import {useCartUI} from './CartUIProvider.client';

/**
 * A client component that contains the merchandise that a customer intends to purchase, and the estimated cost associated with the cart
 */

export default function Cart() {
  const {isCartOpen, closeCart} = useCartUI();
  const {lines, totalQuantity} = useCart();

  return (
    <Transition show={isCartOpen}>
      <Dialog onClose={closeCart}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-40 bg-white bg-opacity-50"
          />
        </Transition.Child>

        {/* Panel */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in-out duration-500"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <Dialog.Panel
            className={clsx(
              'fixed  bottom-0 left-0 right-0 top-0 z-40 flex h-auto w-full flex-col overflow-y-auto rounded-md md:bottom-auto md:left-auto md:mt-12 md:w-4/12',
              '',
            )}
          >
            <div className="relative overflow-hidden rounded-md border border-gray bg-white  drop-shadow-md backdrop-blur-md md:mr-6">
              <div className="container flex flex-col justify-between">
                <CartHeader numLines={lines.length} />
                <div className="mb-auto">
                  {totalQuantity === 0 ? <CartEmpty /> : <CartItems />}
                </div>
                {totalQuantity !== 0 && <CartFooter />}
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

function CartHeader({numLines}: {numLines: number}) {
  const {closeCart} = useCartUI();
  return (
    <div className="flex items-center justify-between py-4">
      <h4>Cart {numLines > 0 && `(${numLines})`}</h4>
      <button type="button" onClick={closeCart}>
        <CloseIcon />
      </button>
    </div>
  );
}

function CartItems() {
  return (
    <div className="mb-8 flex flex-col gap-4" aria-label="Shopping cart">
      <CartLines>
        <LineInCart />
      </CartLines>
    </div>
  );
}

function extractId(gid: string): string | null {
  const regex = /gid:\/\/shopify\/Product\/(\d+)/;
  const match = gid.match(regex);
  return match ? match[1] : null;
}

function LineInCart() {
  const {merchandise} = useCartLine();

  const firstVariant = merchandise.selectedOptions[0];
  const hasDefaultVariantOnly =
    firstVariant.name === 'Title' && firstVariant.value === 'Default Title';

  const productId = extractId(merchandise.product.id);

  return (
    <div className="flex justify-between">
      <div className="flex gap-4">
        {/* Image */}
        <div
          role="cell"
          className="mr-0 aspect-square w-14 flex-shrink-0 rounded-md bg-gray"
        >
          <Link to={`/products/${productId}`}>
            <CartLineImage
              className="rounded "
              style={{mixBlendMode: getBlendMode(merchandise.product)}}
              loaderOptions={{width: 100, height: 100, crop: 'center'}}
            />
          </Link>
        </div>
        {/* Title */}
        <Link className="mr-6" to={`/products/${productId}`}>
          <CartLineProductTitle />
          {/* Price */}
          <CartLinePrice className="" />
        </Link>

        {/* Options */}
        {/* {!hasDefaultVariantOnly && (
          <ul className="mt-1 space-y-1 text-xs text-darkGray">
            {merchandise.selectedOptions.map(({name, value}) => (
              <li key={name}>
                {name}: {value}
              </li>
            ))}
          </ul>
        )} */}
      </div>
      {/* Quantity */}
      {/*  
        <CartItemQuantity />
       */}

      {/* Remove */}
      <div>
        <CartLineQuantityAdjustButton
          adjust="remove"
          aria-label="Remove from cart"
        >
          <button>Remove</button>
        </CartLineQuantityAdjustButton>
      </div>
    </div>
  );
}

function CartItemQuantity() {
  return (
    <div>
      <CartLineQuantityAdjustButton
        adjust="decrease"
        aria-label="Decrease quantity"
        className="disabled:pointer-events-all disabled:cursor-wait"
      >
        <MinusCircleIcon />
      </CartLineQuantityAdjustButton>
      <CartLineQuantity
        as="div"
        className="min-w-[1rem] text-center text-sm font-bold leading-none text-black"
      />
      <CartLineQuantityAdjustButton
        adjust="increase"
        aria-label="Increase quantity"
        className="disabled:pointer-events-all text-black disabled:cursor-wait"
      >
        <PlusCircleIcon />
      </CartLineQuantityAdjustButton>
    </div>
  );
}

function CartFooter() {
  return (
    <div className="mb-3 flex flex-col gap-4 md:mb-6">
      <div className="flex flex-col" role="table" aria-label="Cost summary">
        <div className="flex justify-between">
          <p role="rowheader">Subtotal</p>
          <CartCost amountType="subtotal" role="cell" />
        </div>
        <div>
          <p role="rowheader">Shipping calculated at checkout</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className=" " id="ShopPayButtonContainer">
          <CartShopPayButton className="flex w-full" />
        </div>
        <CartCheckoutButton className="btn-primary">
          Checkout
        </CartCheckoutButton>
      </div>
    </div>
  );
}

function CartEmpty() {
  const {closeCart} = useCartUI();
  return (
    <div className="flex flex-col pb-8">
      <p className="mb-4">Your cart is empty</p>
      <button className="btn-secondary" onClick={closeCart} type="button">
        Continue Shopping
      </button>
    </div>
  );
}
