import {CollectionTitle} from '../global/Header';

export interface NavigationDropdown {
  title: string;
  url?: string;
  children?: NavigationDropdown[];
}

const shopDropdown: NavigationDropdown = {
  title: 'Categories',
  children: [
    {
      title: 'Bags',
      url: 'shop-bags',
    },
    {
      title: 'Clothing',
      url: 'shop-clothing',
      children: [
        {
          title: 'Shirts',
          url: 'testShirts',
        },
      ],
    },
    {
      title: 'Accessories',
      url: 'shop-accessories',
    },
    {
      title: 'Jewelry',
      url: 'shop-jewelry',
    },
    {
      title: 'Shoes',
      url: 'shop-shoes',
    },
  ],
};

const brandDropdown = (
  collectionTitles: CollectionTitle[],
): NavigationDropdown => {
  const base: NavigationDropdown = {title: 'Designers', children: []};

  collectionTitles.forEach((collectionTitle) => {
    const title = collectionTitle.title.replace(' - All', '');
    const url = `${title.toLowerCase().replace(/ /g, '-')}-all`;

    base.children?.push({
      title,
      url,
    });
  });

  return base;
};

export const navigationDropdowns = {
  shopDropdown,
  brandDropdown,
};
