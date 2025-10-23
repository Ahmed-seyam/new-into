import {useEffect, useState} from 'react';
import {client} from '~/lib/storfrontFetch';

export default function Filters() {
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await fetch(client.getStorefrontApiUrl(), {
          method: 'POST',
          headers: client.getPublicTokenHeaders(),
          body: JSON.stringify({query: QUERY_SHOPIFY}),
        });

        if (!response.ok) throw new Error(response.statusText);

        const {data}: any = await response.json();
        setProductTypes(data.productTypes.edges.map((e: any) => e.node));
      } catch (err) {
        console.error('Failed to fetch product types:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchProductTypes();
  }, []);

  if (loading) return <div>Loading filters...</div>;

  return (
    <>
      <div className="relative flex w-full flex-col gap-y-3">Filters</div>
      <div className="relative">
        <div className="grid grid-flow-col gap-4">
          <div>
            <span className="mb-1 text-xxs font-bold">Categories</span>
            {productTypes.map((type) => (
              <div key={type}>{type}</div>
            ))}
          </div>
          <div>
            <h3>Colors</h3>
            <ul>
              <li>Black</li>
              <li>Blue</li>
              <li>Brown</li>
            </ul>
          </div>
          <div>
            <h3>Designers</h3>
          </div>
          <div>
            <h3>Material</h3>
            <ul>
              <li>Cotton</li>
              <li>Leather</li>
              <li>Nylon</li>
            </ul>
          </div>
          <div>
            <h3>Era</h3>
            <ul>
              <li>2020</li>
              <li>2019</li>
              <li>2018</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

const QUERY_SHOPIFY = `
  query CollectionFilters {
    productTypes(first: 250) {
      edges {
        node
      }
    }
  }
`;
