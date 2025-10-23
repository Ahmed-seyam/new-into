// app/routes/sitemap[.]xml.ts
import groq from 'groq';
import { LoaderFunctionArgs } from 'react-router';
import { sanityFetch } from '~/lib/sanity';

type SitemapPage = {
  _updatedAt: string;
  imageUrl: string;
  url: string;
};

type SanityPayload = {
  collections: SitemapPage[];
  home: SitemapPage;
  pages: SitemapPage[];
  products: SitemapPage[];
};

export async function loader({request}: LoaderFunctionArgs) {
  const baseUrl = new URL(request.url).origin;
  const sanityData = await sanityFetch<SanityPayload>(QUERY_SANITY, {baseUrl});

  return new Response(shopSitemap(sanityData, baseUrl), {
    headers: {
      'content-type': 'application/xml',
      'cache-control': `max-age=${60 * 60 * 24}`,
    },
  });
}

function shopSitemap(data: SanityPayload, baseUrl: string) {
  const {collections, home, pages, products} = data;

  const homePage = {
    changeFreq: 'daily',
    ...(home.imageUrl ? {image: {url: home.imageUrl}} : {}),
    lastMod: home._updatedAt,
    url: baseUrl,
  };

  const productPages = products.map((product) => {
    return {
      changeFreq: 'daily',
      ...(product.imageUrl ? {image: {url: product.imageUrl}} : {}),
      lastMod: product._updatedAt,
      url: product.url,
    };
  });

  const collectionPages = collections.map((collection) => {
    return {
      changeFreq: 'daily',
      ...(collection.imageUrl ? {image: {url: collection.imageUrl}} : {}),
      lastMod: collection._updatedAt,
      url: collection.url,
    };
  });

  const standardPages = pages.map((page) => {
    return {
      changeFreq: 'weekly',
      ...(page.imageUrl ? {image: {url: page.imageUrl}} : {}),
      lastMod: page._updatedAt,
      url: page.url,
    };
  });

  const allPages = [
    homePage,
    ...productPages,
    ...collectionPages,
    ...standardPages,
  ];

  return `
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    >
      ${allPages.map((page) => renderUrlTag(page)).join('')}
    </urlset>`;
}

function renderUrlTag({
  url,
  lastMod,
  changeFreq,
  image,
}: {
  url: string;
  lastMod?: string;
  changeFreq?: string;
  image?: {
    url: string;
    title?: string;
    caption?: string;
  };
}) {
  return `
    <url>
      <loc>${url}</loc>
      ${lastMod ? `<lastmod>${lastMod}</lastmod>` : ''}
      <changefreq>${changeFreq}</changefreq>
      ${
        image
          ? `
        <image:image>
          <image:loc>${image.url ?? ''}</image:loc>
        </image:image>`
          : ''
      }
    </url>
  `;
}

const QUERY_SANITY = groq`
{
  "collections": *[
    _type == 'collection'
  ] {
    _updatedAt,
    "imageUrl": coalesce(seo.image.asset->url, store.imageUrl),
    "url": $baseUrl + "/collections/" + store.slug.current,
  },
  "home": *[
    _type == 'home'
  ][0] {
    _updatedAt,
    "imageUrl": coalesce(seo.image.asset->url, store.imageUrl),
  },
  "pages": *[
    _type == 'page'
  ] {
    _updatedAt,
    "imageUrl": seo.image.asset->url,
    "url": $baseUrl + "/pages/" + slug.current,
  },
  "products": *[
    _type == 'product'
    && store.status == 'active'
  ] {
    _updatedAt,
    "imageUrl": coalesce(seo.image.asset->url, store.previewImageUrl),
    "url": $baseUrl + "/products/" + store.slug.current,
  },
}
`;