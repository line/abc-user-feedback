/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
import { useState } from 'react';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useInterval } from 'react-use';
import z from 'zod';

import { Button } from '@ufb/react';

import { TextInput, useOAIMutation } from '@/shared';

const signUpWithEmailSchema = z
  .object({
    email: z.string().email(),
    emailState: z.enum(['NOT_VERIFIED', 'VERIFING', 'EXPIRED', 'VERIFIED']),
    code: z.string().length(6),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: 'must equal Password',
    path: ['confirmPassword'],
  })
  .refine(({ password }) => /[A-Za-z]/.test(password), {
    message: 'must contain at least one letter.',
    path: ['password'],
  })
  .refine(
    ({ password }) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password),
    {
      message: 'must contain at least one special character.',
      path: ['password'],
    },
  )
  .refine(({ password }) => !/(.)\1/.test(password), {
    message: 'must not contain consecutive identical characters',
    path: ['password'],
  });

export type SignUpWithEmailType = z.infer<typeof signUpWithEmailSchema>;

interface IProps {
  onSubmit: (data: SignUpWithEmailType) => void;
  loading?: boolean;
  submitText: string;
  initialValues?: { email: string; password: string } | null;
}

const SignUpWithEmailForm: React.FC<IProps> = (props) => {
  const { onSubmit, loading, submitText, initialValues } = props;
  const { t } = useTranslation();
  const router = useRouter();

  const methods = useForm<SignUpWithEmailType>({
    resolver: zodResolver(signUpWithEmailSchema),
    defaultValues: initialValues ?? { emailState: 'NOT_VERIFIED', code: '' },
  });
  const {
    handleSubmit,
    register,
    formState,
    setValue,
    watch,
    setError,
    clearErrors,
  } = methods;

  const [expiredTime, setExpiredTime] = useState<string>();

  const { mutate: fetchCode, status: fetchCodeStatus } = useOAIMutation({
    method: 'post',
    path: '/api/admin/auth/email/code',
    queryOptions: {
      onSuccess(data) {
        setValue('emailState', 'VERIFING');
        setExpiredTime(data?.expiredAt);
        clearErrors('email');
      },
      onError(error) {
        const { message } = error;
        setError('email', { message });
      },
    },
  });
  const onClickFetchCode = () => {
    const email = watch('email');
    if (!email) {
      setError('email', { message: 'Email is required' });
      return;
    }
    fetchCode({ email });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <div className="mb-12 flex flex-col gap-4">
          <div className="flex gap-2">
            <TextInput
              type="email"
              {...register('email')}
              label="Email"
              placeholder={t('v2.placeholder.text')}
              disabled={watch('emailState') !== 'NOT_VERIFIED'}
              error={formState.errors.email?.message}
              infoCaption={
                watch('emailState') !== 'NOT_VERIFIED' ?
                  t('v2.text.request-email-auth')
                : undefined
              }
              rightButton={
                <Button
                  type="button"
                  onClick={onClickFetchCode}
                  loading={fetchCodeStatus === 'pending'}
                  disabled={watch('emailState') === 'VERIFIED'}
                  className="min-w-[96px]"
                >
                  {t('v2.auth.sign-up.button.request-auth-code')}
                </Button>
              }
            />
          </div>
          {watch('emailState') !== 'NOT_VERIFIED' && (
            <AuthenticationCodeInput expiredTime={expiredTime} />
          )}
          <TextInput
            type="password"
            label="Password"
            placeholder={t('v2.placeholder.text')}
            error={formState.errors.password?.message}
            {...register('password')}
          />
          <TextInput
            type="password"
            label="Confirm Password"
            placeholder={t('v2.placeholder.text')}
            error={formState.errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>
        <div className="flex flex-col gap-4">
          <Button
            size="medium"
            type="submit"
            loading={loading}
            disabled={!formState.isDirty || watch('emailState') !== 'VERIFIED'}
          >
            {submitText}
          </Button>
          <Button size="medium" variant="outline" onClick={router.back}>
            {t('button.back')}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

const AuthenticationCodeInput = ({ expiredTime }: { expiredTime?: string }) => {
  const { t } = useTranslation();
  const { register, watch, formState, setValue, clearErrors, setError } =
    useFormContext<SignUpWithEmailType>();
  const [leftTime, setLeftTime] = useState('');

  const { mutate: verifyCode, status: verifyCodeStatus } = useOAIMutation({
    method: 'post',
    path: '/api/admin/auth/email/code/verify',
    queryOptions: {
      onSuccess() {
        setValue('emailState', 'VERIFIED');
        clearErrors('code');
      },
      onError(error) {
        const { message } = error;
        setError('code', { message });
      },
    },
  });

  useInterval(
    () => {
      const seconds = dayjs(expiredTime).diff(dayjs(), 'seconds');

      if (seconds < 0) {
        setLeftTime(`00:00`);
        setValue('emailState', 'EXPIRED');
      } else {
        const m = Math.floor(seconds / 60)
          .toString()
          .padStart(2, '0');
        const s = Math.floor(seconds % 60)
          .toString()
          .padStart(2, '0');

        setLeftTime(`${m}:${s}`);
      }
    },
    watch('emailState') === 'VERIFING' ? 1000 : null,
  );
  const onClickVerifyCode = () => {
    const code = watch('code');
    if (!code) return;
    const email = watch('email');
    verifyCode({ code, email });
  };

  return (
    <div className="flex gap-2">
      <TextInput
        type="text"
        label="Authentication code"
        {...register('code')}
        disabled={watch('emailState') === 'VERIFIED'}
        placeholder={t('v2.placeholder.text')}
        error={formState.errors.code?.message}
        right={
          (watch('emailState') === 'VERIFING' ||
            watch('emailState') === 'EXPIRED') && (
            <p className="font-16-regular">{leftTime}</p>
          )
        }
        rightButton={
          <Button
            loading={verifyCodeStatus === 'pending'}
            disabled={
              watch('emailState') === 'VERIFIED' || watch('code').length !== 6
            }
            onClick={onClickVerifyCode}
            className="min-w-[96px]"
          >
            {t('v2.auth.sign-up.button.verify-auth-code')}
          </Button>
        }
        successCaption={
          watch('emailState') === 'VERIFIED' ? 'Authenticated.' : undefined
        }
      />
    </div>
  );
};

export default SignUpWithEmailForm;
