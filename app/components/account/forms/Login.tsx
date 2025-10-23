import {useCallback} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Link, useNavigate} from 'react-router';
import FormCardWrapper from '~/components/account/FormCardWrapper';
import FormFieldText from '~/components/account/FormFieldText';

type FormValues = {
  email: string;
  password: string;
};

type ApiResponse = {
  error?: string;
};

const schema = yup
  .object({
    email: yup.string().email('Please enter a valid email'),
    password: yup.string().required('Please enter your password'),
  })
  .required();

export default function LoginForm() {
  const {
    formState: {errors, isDirty, isSubmitting, isSubmitSuccessful},
    handleSubmit,
    register,
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema) as any,
  });

  const navigate = useNavigate();

  const handleLogin: any = useCallback(
    async (formData) => {
      const response = (await callLoginApi(formData)) as ApiResponse;

      if (response.error) {
        setError('root', {
          message:
            'Sorry, we did not recognize either your email or password. Please try again or create a new account.',
          type: 'custom',
        });
        return;
      }

      void navigate('/account');
    },
    [navigate, setError],
  );

  const onSubmit = (e?: React.BaseSyntheticEvent) => {
    void handleSubmit(handleLogin)(e);
  };

  return (
    <div>
      <FormCardWrapper title="Sign in">
        <form className="mx-auto grid grid-flow-row gap-6" onSubmit={onSubmit}>
          {/* Form error */}
          {errors?.root?.message && (
            <div className="mb-6 flex items-center justify-center rounded-sm border border-red p-4 text-sm text-red">
              <p>{errors.root.message}</p>
            </div>
          )}
          <div className="grid grid-flow-row gap-4">
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
              autoComplete="current-password"
              disabled={isSubmitting || isSubmitSuccessful}
              error={errors.password?.message}
              label="Password"
              type="password"
              {...register('password')}
            />
          </div>

          {/* Footer */}
          <div className="grid grid-flow-row gap-6">
            <div>
              <button
                className="btn-primary w-full"
                disabled={!isDirty || isSubmitting || isSubmitSuccessful}
                type="submit"
              >
                {isSubmitting || isSubmitSuccessful
                  ? 'Signing in...'
                  : 'Sign in'}
              </button>
            </div>
            <div className="grid grid-flow-col text-center">
              <Link to="/account/register">Create an account</Link>
              <Link to="/account/recover">Forgot password?</Link>
            </div>
          </div>
        </form>
      </FormCardWrapper>
    </div>
  );
}

export async function callLoginApi({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<ApiResponse> {
  try {
    const res = await fetch(`/api/account/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
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
