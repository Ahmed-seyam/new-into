import {yupResolver} from '@hookform/resolvers/yup';
import {useCallback} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {useNavigate} from 'react-router';
import Button from '~/components/elements/Button';
import FormCardWrapper from '~/components/account/FormCardWrapper';
import FormFieldText from '~/components/account/FormFieldText';

type FormValues = {
  password: string;
  passwordRepeat: string;
};

type Props = {
  id: string;
  resetToken: string;
};

type ApiResponse = {
  error?: string;
};

const schema = yup
  .object({
    password: yup
      .string()
      .required('Please enter a password')
      .min(5, 'Passwords must have at least 5 characters'),
    passwordRepeat: yup.string().when('password', {
      is: (field: string) => field.length > 0,
      then: (schema) =>
        schema.oneOf([yup.ref('password')], 'Passwords must match'),
    }),
  })
  .required();

export default function ResetPasswordForm({id, resetToken}: Props) {
  const {
    formState: {errors, isDirty, isSubmitting, isSubmitSuccessful},
    handleSubmit,
    register,
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      password: '',
      passwordRepeat: '',
    },
    resolver: yupResolver(schema) as any,
  });

  const navigate = useNavigate();

  const handleReset: any = useCallback(
    async (formData: FormValues) => {
      const response = (await callPasswordResetApi({
        id,
        password: formData.password,
        resetToken,
      })) as ApiResponse;

      if (response.error) {
        setError('root', {
          message: response.error,
          type: 'custom',
        });
        return;
      }

      void navigate('/account');
    },
    [id, navigate, resetToken, setError],
  );

  const onSubmit = (e?: React.BaseSyntheticEvent) => {
    void handleSubmit(handleReset)(e);
  };

  return (
    <div className="my-24 flex justify-center px-4">
      <FormCardWrapper title="Reset password">
        <p className="my-4 text-sm">Enter a new password for your account.</p>
        <form onSubmit={onSubmit}>
          {/* Form error */}
          {errors?.root?.message && (
            <div className="mb-6 flex items-center justify-center rounded-sm border border-red p-4 text-sm text-red">
              <p>{errors.root.message}</p>
            </div>
          )}

          <div className="space-y-12">
            <div className="space-y-4">
              {/* Password */}
              <FormFieldText
                disabled={isSubmitting || isSubmitSuccessful}
                error={errors.password?.message}
                label="Password"
                type="password"
                {...register('password')}
              />

              {/* Password (repeat) */}
              <FormFieldText
                disabled={isSubmitting || isSubmitSuccessful}
                error={errors.passwordRepeat?.message}
                label="Repeat password"
                type="password"
                {...register('passwordRepeat')}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 space-y-4">
            <Button
              disabled={!isDirty || isSubmitting || isSubmitSuccessful}
              type="submit"
            >
              {isSubmitting || isSubmitSuccessful ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </FormCardWrapper>
    </div>
  );
}

export async function callPasswordResetApi({
  id,
  resetToken,
  password,
}: {
  id: string;
  resetToken: string;
  password: string;
}): Promise<ApiResponse> {
  try {
    const res = await fetch(`/api/account/reset`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id, resetToken, password}),
    });

    if (res.ok) {
      return {};
    } else {
      return res.json();
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.toString()
          : 'An unknown error has occurred',
    };
  }
}
