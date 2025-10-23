import {Image} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {OrderWithNodes} from '~/types';
import {getOrderStatusMessage} from '~/utils/getOrderStatusMessage';
import Badge from '~/components/elements/Badge';

type Props = {
  order?: OrderWithNodes;
};

export function OrderCard({order}: Props) {
  if (!order?.id) return null;
  const legacyOrderId = order!.id!.split('/').pop()!.split('?')[0];

  const lineItems = order?.lineItems?.nodes;

  return (
    <li className="flex flex-col rounded border border-darkGray/50 p-4">
      <div className="mb-1 inline-flex">
        <Badge
          mode="outline"
          label={getOrderStatusMessage(order.fulfillmentStatus)}
          small
        />
      </div>

      {lineItems[0].variant?.image && (
        <div className="bg-primary/5 my-2 aspect-square overflow-hidden rounded-sm">
          <Image
            alt={lineItems[0].variant?.image?.altText ?? 'Order image'}
            className="fadeIn cover w-full"
            data={lineItems[0].variant?.image}
            aspectRatio="1/1"
            sizes="168px"
          />
        </div>
      )}

      <ul className="mt-2 flex-1 flex-row space-y-1">
        <li className="font-bold">
          {new Date(order.processedAt).toDateString()}
        </li>
        <li>#{order.orderNumber}</li>
        <li>
          {lineItems.length > 1
            ? `${lineItems[0].title} +${lineItems.length - 1} more`
            : lineItems[0].title}
        </li>
      </ul>

      <div className="mt-10 flex flex-row text-sm font-medium text-darkGray">
        <Link
          className="linkTextNavigation"
          to={`/account/orders/${legacyOrderId}`}
          prefetch="intent"
        >
          View details
        </Link>
      </div>
    </li>
  );
}
