// app/routes/robots[.]txt.ts
export async function loader() {
  const url = new URL(import.meta.env.PUBLIC_STORE_DOMAIN || 'https://example.com');
  const sitemapUrl = `${url.origin}/sitemap.xml`;

  const robotsTxt = `
User-agent: *
Disallow: /admin
Disallow: /cart
Disallow: /orders
Disallow: /checkouts/
Disallow: /checkout
Disallow: /carts
Disallow: /account
Sitemap: ${sitemapUrl}

# Google adsbot ignores robots.txt unless specifically named!
User-agent: adsbot-google
Disallow: /checkouts/
Disallow: /checkout
Disallow: /carts
Disallow: /orders

User-agent: Pinterest
Crawl-delay: 1
`.trim();

  return new Response(robotsTxt, {
    headers: {
      'content-type': 'text/plain',
      'cache-control': `max-age=${60 * 60 * 24}`,
    },
  });
}