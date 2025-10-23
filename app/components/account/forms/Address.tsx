import {yupResolver} from '@hookform/resolvers/yup';
import type {MailingAddress} from '@shopify/hydrogen/storefront-api-types';
import {useCallback} from 'react';
import {SubmitHandler, useForm, UseFormReturn} from 'react-hook-form';
import {useRevalidator} from 'react-router';
import * as yup from 'yup';
import Button from '~/components/elements/Button';
import {callDeleteAddressApi} from '~/components/account/DeleteAddress';
import FormFieldCheckbox from '~/components/account/FormFieldCheckbox';
import FormFieldSelect from '~/components/account/FormFieldSelect';
import FormFieldText from '~/components/account/FormFieldText';
import sanitizeFormObject from '~/components/account/utils/sanitizeFormObject';
import {MailingAddressExtended} from '~/types';

type MailingAddressValues = Pick<
  MailingAddress,
  | 'address1'
  | 'address2'
  | 'city'
  | 'company'
  | 'country'
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'province'
  | 'zip'
> &
  Partial<Pick<MailingAddress, 'id'>>;

type FormValues = MailingAddressValues & {
  isDefaultAddress?: boolean;
};

type Props = {
  address: Partial<MailingAddressExtended>;
  isDefaultAddress: boolean;
  onClose: () => void;
};

const schema: any = yup
  .object({
    address1: yup.string(),
    address2: yup.string(),
    city: yup.string(),
    company: yup.string(),
    country: yup.string(),
    firstName: yup.string().required('Please enter your first name'),
    isDefaultAddress: yup.boolean(),
    lastName: yup.string().required('Please enter your last name'),
    phone: yup
      .string()
      .matches(
        /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/,
        {
          excludeEmptyString: true,
          message: 'Please enter a valid phone number',
        },
      ),
    province: yup.string(),
    zip: yup.string(),
  })
  .required();

export default function AddressForm({
  address,
  isDefaultAddress,
  onClose,
}: Props) {
  type FormConfig = FormValues & {
    serverError?: string;
  };

  const {
    formState: {errors, isDirty, isSubmitting, isSubmitSuccessful},
    handleSubmit,
    register,
    setError,
  } = useForm({
    defaultValues: {
      ...(sanitizeFormObject(address) as Partial<FormValues>),
      isDefaultAddress,
    },
    resolver: yupResolver(schema),
  }) as UseFormReturn<FormConfig>;

  // Revalidate to refresh server components
  const revalidator = useRevalidator();

  const handleDelete = useCallback(async () => {
    if (address.originalId) {
      const response: any = await callDeleteAddressApi(address?.originalId);
      if (response.error) {
        setError('root', {
          message: response.error,
          type: 'custom',
        });
        return;
      }
    }
    revalidator.revalidate().catch(console.error);

    onClose();
  }, [address?.originalId, onClose, revalidator, setError]);

  const handleUpdate: SubmitHandler<FormValues> = useCallback(
    async (formData) => {
      const response: any = await callUpdateAddressApi({
        ...formData,
        id: address.originalId,
      });

      if (response.error) {
        setError('root', {
          message: response.error,
          type: 'custom',
        });
        return;
      }

      revalidator.revalidate().catch(console.error);

      onClose();
    },
    [address.originalId, onClose, revalidator, setError],
  );

  return (
    <form onSubmit={() => handleSubmit(handleUpdate)}>
      {/* Form error */}
      {errors?.root?.message && (
        <div className="mb-6 flex items-center justify-center rounded-sm border border-red p-4 text-sm text-red">
          <p>{errors.root.message}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Country */}
        <FormFieldSelect
          autoComplete="country-name"
          disabled={isSubmitting || isSubmitSuccessful}
          error={errors.country?.message}
          label="Country / region"
          {...register('country')}
        />

        {/* First + last name */}
        <div className="flex w-full gap-3">
          <FormFieldText
            autoComplete="given-name"
            disabled={isSubmitting || isSubmitSuccessful}
            error={errors.firstName?.message}
            label="First name"
            {...register('firstName')}
          />

          <FormFieldText
            autoComplete="family-name"
            disabled={isSubmitting || isSubmitSuccessful}
            error={errors.lastName?.message}
            label="Last name"
            {...register('lastName')}
          />
        </div>

        {/* Organization */}
        <FormFieldText
          autoComplete="organization"
          disabled={isSubmitting || isSubmitSuccessful}
          error={errors.company?.message}
          label="Company"
          {...register('company')}
        />

        {/* Address 1 */}
        <FormFieldText
          autoComplete="address-line1"
          disabled={isSubmitting || isSubmitSuccessful}
          error={errors.address1?.message}
          label="Address"
          {...register('address1')}
        />

        {/* Address 2 */}
        <FormFieldText
          autoComplete="address-line2"
          disabled={isSubmitting || isSubmitSuccessful}
          error={errors.address1?.message}
          label="Apartment, suite, etc."
          {...register('address2')}
        />

        {/* City / Province / Postal code */}
        <div className="flex gap-3">
          <FormFieldText
            autoComplete="address-level2"
            disabled={isSubmitting || isSubmitSuccessful}
            error={errors.address1?.message}
            label="City"
            {...register('city')}
          />

          <FormFieldText
            autoComplete="address-level1"
            disabled={isSubmitting || isSubmitSuccessful}
            error={errors.province?.message}
            label="State / Province"
            {...register('province')}
          />

          <FormFieldText
            autoComplete="postal-code"
            disabled={isSubmitting || isSubmitSuccessful}
            error={errors.zip?.message}
            label="Postal code"
            {...register('zip')}
          />
        </div>

        {/* Phone */}
        <FormFieldText
          autoComplete="tel"
          disabled={isSubmitting || isSubmitSuccessful}
          error={errors.phone?.message}
          label="Phone"
          type="tel"
          {...register('phone')}
        />

        {/* Default address */}
        <FormFieldCheckbox
          disabled={isSubmitting || isSubmitSuccessful}
          error={errors.isDefaultAddress?.message}
          label="Default address"
          {...register('isDefaultAddress')}
        />
      </div>

      {/* Footer */}
      <div className="mt-10 flex justify-between">
        <Button
          disabled={isSubmitting || isSubmitSuccessful}
          mode="outline"
          onClick={() => handleSubmit(handleDelete)}
          tone="critical"
          type="button"
        >
          Delete
        </Button>
        <div className="flex gap-2">
          <Button
            disabled={isSubmitting || isSubmitSuccessful}
            mode="outline"
            onClick={onClose}
            type="button"
          >
            Cancel
          </Button>
          <Button
            disabled={!isDirty || isSubmitting || isSubmitSuccessful}
            type="submit"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </form>
  );
}

export async function callUpdateAddressApi({
  address1,
  address2,
  city,
  company,
  country,
  firstName,
  id,
  isDefaultAddress,
  lastName,
  phone,
  province,
  zip,
}: FormValues) {
  try {
    const res = await fetch(
      id
        ? `/api/account/address/${encodeURIComponent(id)}`
        : '/api/account/address',
      {
        method: id ? 'PATCH' : 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          company,
          address1,
          address2,
          country,
          province,
          city,
          phone,
          zip,
          isDefaultAddress,
        }),
      },
    );
    if (res.ok) {
      return {};
    } else {
      return res.json();
    }
  } catch (_e) {
    return {
      error: 'Error saving address. Please try again.',
    };
  }
}
