import {useCallback} from 'react';
import {useRevalidator} from 'react-router';
import Button from '~/components/elements/Button';

type Props = {
  addressId: string;
  onClose: () => void;
};

type ApiResponse = {
  error?: string;
};

export default function AccountDeleteAddress({addressId, onClose}: Props) {
  const revalidator = useRevalidator();

  const deleteAddress = useCallback(
    async (id: string) => {
      const response = (await callDeleteAddressApi(id)) as ApiResponse;
      if (response.error) {
        alert(response.error);
        return;
      }
      void revalidator.revalidate();
      onClose();
    },
    [onClose, revalidator],
  );

  const handleConfirmDelete = useCallback(() => {
    if (addressId) {
      void deleteAddress(addressId);
    }
  }, [addressId, deleteAddress]);

  return (
    <>
      <h3 className="text-xl font-bold">Confirm removal</h3>

      <p className="my-4">Are you sure you wish to remove this address?</p>

      <div className="mt-6 flex gap-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirmDelete}>Confirm</Button>
      </div>
    </>
  );
}

export async function callDeleteAddressApi(id: string): Promise<ApiResponse> {
  try {
    const res = await fetch(`/api/account/address/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    });
    if (res.ok) {
      return {};
    } else {
      return res.json();
    }
  } catch (_e) {
    return {
      error: 'Error removing address. Please try again.',
    };
  }
}
