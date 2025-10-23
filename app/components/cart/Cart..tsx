import {Dialog, Transition} from '@headlessui/react';
import {Fragment} from 'react';
import {Link} from 'react-router';
import clsx from 'clsx';
import {useCart} from '~/contexts/CartContext';
import CloseIcon from '~/components/icons/Close';
import CartLine from './CartLine';

export default function Cart() {
  const {cart, cartOpen, closeCart, isLoading} = useCart();

  return (
    <Transition show={cartOpen}>
      <Dialog onClose={closeCart} className="relative z-50">
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        {/* Panel */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <Dialog.Panel className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray p-4">
                <Dialog.Title className="text-lg font-bold">
                  Cart ({cart?.totalQuantity || 0})
                </Dialog.Title>
                <button onClick={closeCart} className="p-2">
                  <CloseIcon />
                </button>
              </div>

              {/* Cart Lines */}
              <div className="flex-1 overflow-y-auto p-4">
                {!cart || cart.lines.nodes.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-darkGray">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.lines.nodes.map((line) => (
                      <CartLine key={line.id} line={line} />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart && cart.lines.nodes.length > 0 && (
                <div className="border-t border-gray p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-lg font-bold">Subtotal</span>
                    <span className="text-lg font-bold">
                      {cart.cost.subtotalAmount.currencyCode}{' '}
                      {parseFloat(cart.cost.subtotalAmount.amount).toFixed(2)}
                    </span>
                  </div>
                  <a
                    href={cart.checkoutUrl}
                    className="btn-primary block w-full text-center"
                  >
                    Checkout
                  </a>
                  <button
                    onClick={closeCart}
                    className="mt-2 w-full text-center text-sm text-darkGray hover:text-offBlack"
                  >
                    Continue shopping
                  </button>
                </div>
              )}
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
