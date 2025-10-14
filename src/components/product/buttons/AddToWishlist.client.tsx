import React, {useEffect, useState} from 'react';
import {compose, lifecycle, withHandlers, withStateHandlers} from 'recompose';

export default function AddToWishlist(product) {
  // TODO: We currently render `react-social-media-embed` components after initial mount to
  // prevent hydration errors for now.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {}, [product]);
  if (mounted) {
    return <button className="btn-secondary">Add to Wishlist</button>;
  } else {
    return <button>Loading...</button>;
  }
}

/*
export const AddToWishlist = compose(
  lifecycle({
    // fetch wishlist
    componentDidMount() {
      const p = this.props;
      const item = p.item;
      const selectedVariantId = item.get('selected_variant_id');

      function checkIfAlreadyInWishlist() {
        window._swat.fetch(function (response) {
          response.map(function (item) {
            // add a class to change the CSS of the already existing wishlist items
            $('button[findify-product-variant-id=' + item.epi + ']').addClass(
              'findify-added-to-wishlist disabled swym-added',
            );
          });
        });
      }
      setTimeout(checkIfAlreadyInWishlist(selectedVariantId), 500);
    },
  }),
  withStateHandlers(
    () => ({
      // default state of wishlist items
      isAdded: false,
    }),
    {
      // function to toggle the state to true or false
      addToWishlist:
        ({isAdded}) =>
        (isAdded) => ({isAdded: isAdded}),
    },
  ),
  withHandlers({
    // onClick is going to use "addToWishlist" & "isAdded" as well as information from "item"
    onClick:
      ({item, addToWishlist, isAdded}) =>
      async (event) => {
        event.stopPropagation();
        event.preventDefault();

        const selectedVariantId = item.get('selected_variant_id');

        // remove product
        if (
          $(
            'button[findify-product-variant-id=' + selectedVariantId + ']',
          ).hasClass('findify-added-to-wishlist')
        ) {
          addToWishlist(true);
          function removeProductFromWishlist() {
            var wishlist = $(
              '<div className="findify-wishlist-heart"><button className="findify-wishlist-button" findify-product-variant-id=' +
                selectedVariantId +
                '></button></div>',
            );
            window._swat.removeFromWishList(
              {
                // the fetch request is going to need some information, be aware that you need to replace <ADD STORE URL HERE> with the url of your store
                epi: selectedVariantId,
                du:
                  '<ADD STORE URL HERE>' +
                  item.get('product_url').split('?')[0],
                empi: item.get('id'),
                iu: item.get('image_url'),
                pr: item.getIn(['price', 0]),
                stk: item.get('quantity'),
                dt: item.get('title'),
              },
              function (r) {
                addToWishlist(false);
              },
            );
            return wishlist;
          }

          removeProductFromWishlist(selectedVariantId);
        } else {
          // add product
          function addWishlist() {
            var wishlist = $(
              '<div className="findify-wishlist-heart"><button className="findify-wishlist-button" findify-product-variant-id=' +
                selectedVariantId +
                '></button></div>',
            );
            debugger;
            window._swat.addToWishList(
              {
                // the fetch request is going to need some information, be aware that you need to replace <ADD STORE URL HERE> with the url of your store
                epi: selectedVariantId,
                du:
                  '<add store url here>' +
                  item.get('product_url').split('?')[0],
                empi: item.get('id'),
                iu: item.get('image_url'),
                pr: item.getIn(['price', 0]),
                stk: item.get('quantity'),
                dt: item.get('title'),
              },
              function (r) {
                addToWishlist(true);
              },
            );
            return wishlist;
          }

          addWishlist(selectedVariantId);
        }
      },
  }),
  // don't forget to include the props we need below
)(({onClick, item, addToWishlist, isAdded}) => {
  const selectedVariantId = item.get('selected_variant_id');

  //
  return (
    <div className="findify-wishlist-heart" onClick={onClick}>
      <button
        // depending if "isAdded" is true or false, we return different classNames
        className={
          isAdded
            ? 'findify-wishlist-button findify-added-to-wishlist swym-button swym-add-to-wishlist-view-product swym-icontext swym-heart disabled swym-added swym-loaded'
            : 'findify-wishlist-button swym-button swym-add-to-wishlist-view-product swym-icontext swym-heart swym-loaded'
        }
        findify-product-variant-id={selectedVariantId}
      ></button>
    </div>
  );
});
*/
