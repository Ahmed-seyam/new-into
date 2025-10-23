import {useCallback} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigate, Link} from 'react-router';
import FormCardWrapper from '~/components/account/FormCardWrapper';
import FormFieldText from '~/components/account/FormFieldText';
import {callLoginApi} from './Login';

type FormValues = {
  email: string;
  password: string;
  passwordRepeat: string;
};

type ApiResponse = {
  error?: string;
};

const schema = yup
  .object({
    email: yup.string().email('Please enter a valid email'),
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

export default function RegisterForm() {
  const {
    formState: {errors, isDirty, isSubmitting, isSubmitSuccessful},
    handleSubmit,
    register,
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
      passwordRepeat: '',
    },
    resolver: yupResolver(schema) as any,
  });

  const navigate = useNavigate();

  const handleRegister: any = useCallback(
    async (formData: FormValues) => {
      const response = (await callAccountCreateApi({
        email: formData.email,
        password: formData.password,
      })) as ApiResponse;

      if (response.error) {
        setError('root', {
          message: response.error,
          type: 'custom',
        });
        return;
      }

      // this can be avoided if customerCreate mutation returns customerAccessToken
      await callLoginApi({
        email: formData.email,
        password: formData.password,
      });

      void navigate('/account');
    },
    [navigate, setError],
  );

  const onSubmit = (e?: React.BaseSyntheticEvent) => {
    void handleSubmit(handleRegister)(e);
  };

  return (
    <div className="">
      <FormCardWrapper title="Create an account">
        <form onSubmit={onSubmit}>
          {/* Form error */}
          {errors?.root?.message && (
            <div className="mb-6 flex items-center justify-center rounded-sm border border-red p-4 text-sm text-red">
              <p>{errors.root.message}</p>
            </div>
          )}

          <div className="space-y-12">
            <div className="space-y-4">
              {/* Email */}
              <FormFieldText
                autoComplete="email"
                disabled={isSubmitting || isSubmitSuccessful}
                error={errors.email?.message}
                label="Email address"
                type="text"
                {...register('email')}
              />

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
            <button
              className="btn-primary"
              disabled={!isDirty || isSubmitting || isSubmitSuccessful}
              type="submit"
            >
              {isSubmitting || isSubmitSuccessful
                ? 'Creating...'
                : 'Create account'}
            </button>
            <div className="flex justify-between">
              <p className="text-sm">
                Already have an account? &nbsp;
                <Link className="inline underline" to="/account">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </form>
      </FormCardWrapper>
    </div>
  );
}

export async function callAccountCreateApi({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<ApiResponse> {
  try {
    const res = await fetch(`/account/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password, firstName, lastName}),
    });
    if (res.status === 200) {
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
