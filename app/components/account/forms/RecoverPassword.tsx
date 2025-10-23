import {yupResolver} from '@hookform/resolvers/yup';
import {useCallback} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import * as yup from 'yup';
import FormCardWrapper from '../FormCardWrapper';
import FormFieldText from '../FormFieldText';
import {Link} from 'react-router';

type FormValues = yup.InferType<typeof schema>;

const schema = yup
  .object({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Email is required'),
  })
  .required();
const resolver = yupResolver<FormValues, any, FormValues>(schema);

export default function RecoverPasswordForm() {
  const {
    formState: {errors, isDirty, isSubmitting, isSubmitSuccessful},
    handleSubmit,
    register,
    setError,
  } = useForm<FormValues>({
    defaultValues: {email: ''},
    resolver,
  });

  const handleRecover: SubmitHandler<FormValues> = useCallback(
    async (data) => {
      const response: any = await callAccountRecoverApi({email: data.email});
      if (response.error) {
        setError('root', {message: response.error, type: 'custom'});
      }
    },
    [setError],
  );

  return (
    <div className="flex justify-center">
      <FormCardWrapper title="Recover password">
        {isSubmitSuccessful ? (
          <>
            <div className="text-sm">
              <p>
                If that email address is in our system, you&apos;ll receive an
                email with instructions on how to reset your password in a few
                minutes.
              </p>
            </div>
            <div className="mt-4 flex justify-center">
              <Link className="btn-secondary" to="/account/login" type="button">
                Back to sign in
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="my-4 text-sm">
              Enter your email address to receive a password reset link.
            </p>
            <form onSubmit={(e) => void handleSubmit(handleRecover)(e)}>
              {errors.root && (
                <div className="mb-6 flex items-center justify-center rounded-sm border border-red p-4 text-sm text-red">
                  <p>{errors.root.message}</p>
                </div>
              )}
              <div className="space-y-12">
                <div className="space-y-4">
                  <FormFieldText
                    autoComplete="email"
                    disabled={isSubmitting || isSubmitSuccessful}
                    error={errors.email?.message}
                    label="Email address"
                    type="text"
                    {...register('email')}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <Link
                  to="/account/login"
                  type="button"
                  className="btn-secondary"
                >
                  Cancel
                </Link>
                <button
                  disabled={!isDirty || isSubmitting || isSubmitSuccessful}
                  type="submit"
                  className="btn-primary"
                >
                  {isSubmitting ? 'Processing...' : 'Send reset link'}
                </button>
              </div>
            </form>
          </>
        )}
      </FormCardWrapper>
    </div>
  );
}

export async function callAccountRecoverApi({email}: {email: string}) {
  try {
    const res = await fetch('/api/account/recover', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email}),
    });
    if (res.ok) return {};
    return res.json();
  } catch (error) {
    return {error: error instanceof Error ? error.message : 'Unknown error'};
  }
}
