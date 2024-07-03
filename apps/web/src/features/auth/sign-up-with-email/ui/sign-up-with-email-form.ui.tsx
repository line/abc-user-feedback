/**
 * Copyright 2023 LINE Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
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
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useInterval } from 'react-use';
import type { z } from 'zod';

import { TextInput, toast } from '@ufb/ui';

import { Path, useOAIMutation } from '@/shared';

import { signUpWithEmailSchema } from '../sign-up-with-email.schema';

type FormType = z.infer<typeof signUpWithEmailSchema>;

interface IProps {}

const SignUpWithEmailForm: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState,
    getValues,
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm<FormType>({
    resolver: zodResolver(signUpWithEmailSchema),
    defaultValues: { emailState: 'NOT_VERIFIED' },
  });

  const [expiredTime, setExpiredTime] = useState<string>();
  const [leftTime, setLeftTime] = useState('');

  const { mutate: signUp } = useOAIMutation({
    method: 'post',
    path: '/api/admin/auth/signUp/email',
    queryOptions: {
      onSuccess() {
        router.push(Path.SIGN_IN);
        toast.positive({ title: 'Success' });
      },
      onError(error) {
        const { code, message } = error;
        toast.negative({ title: message, description: code });
      },
    },
  });

  const { mutate: fetchCode, status: fetchCodeStatus } = useOAIMutation({
    method: 'post',
    path: '/api/admin/auth/email/code',
    queryOptions: {
      onSuccess(data) {
        setValue('emailState', 'VERIFING');
        setExpiredTime(data?.expiredAt);
        clearErrors('email');
        toast.positive({ title: 'Success' });
      },
      onError(error) {
        const { message } = error;
        setError('email', { message });
        toast.negative({ title: message });
      },
    },
  });

  const { mutate: verifyCode, status: verifyCodeStatus } = useOAIMutation({
    method: 'post',
    path: '/api/admin/auth/email/code/verify',
    queryOptions: {
      onSuccess() {
        setValue('emailState', 'VERIFIED');
        clearErrors('code');
        toast.positive({ title: 'Success' });
      },
      onError(error) {
        const { message } = error;
        setError('code', { message });
        toast.negative({ title: message });
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

  return (
    <form onSubmit={handleSubmit((data) => signUp(data))}>
      <div className="mb-12 space-y-4">
        <TextInput
          size="lg"
          type="email"
          {...register('email')}
          label="Email"
          placeholder={t('input.placeholder.email')}
          disabled={watch('emailState') === 'VERIFIED'}
          isValid={!formState.errors.email}
          isSubmitted={
            fetchCodeStatus === 'error' || fetchCodeStatus === 'success'
          }
          isSubmitting={fetchCodeStatus === 'pending'}
          hint={formState.errors.email?.message}
          rightChildren={
            <button
              type="button"
              className="btn btn-secondary btn-xs btn-rounded"
              onClick={() => fetchCode({ email: getValues('email') })}
              disabled={watch('emailState') === 'VERIFIED'}
            >
              {t('auth.sign-up.button.request-auth-code')}
            </button>
          }
          required
        />
        {watch('emailState') !== 'NOT_VERIFIED' && (
          <TextInput
            size="lg"
            type="code"
            label={t('auth.sign-up.label.auth-code')}
            {...register('code')}
            disabled={watch('emailState') === 'VERIFIED'}
            placeholder={t('auth.sign-up.placeholder.auth-code')}
            isValid={!formState.errors.code}
            isSubmitted={
              verifyCodeStatus === 'error' || verifyCodeStatus === 'success'
            }
            isSubmitting={verifyCodeStatus === 'pending'}
            hint={formState.errors.code?.message}
            rightChildren={
              <div className="flex items-center gap-2">
                {(watch('emailState') === 'VERIFING' ||
                  watch('emailState') === 'EXPIRED') && (
                  <p className="font-16-regular">{leftTime}</p>
                )}
                <button
                  type="button"
                  className="btn btn-secondary btn-xs btn-rounded"
                  disabled={
                    watch('emailState') === 'VERIFIED' ||
                    watch('code')?.length !== 6
                  }
                  onClick={() => {
                    const code = getValues('code');
                    if (!code) return;
                    verifyCode({ code, email: getValues('email') });
                  }}
                >
                  {t('auth.sign-up.button.verify-auth-code')}
                </button>
              </div>
            }
            required
          />
        )}
        <TextInput
          size="lg"
          type="password"
          label={t('input.label.password')}
          placeholder={t('input.placeholder.password')}
          isSubmitted={formState.isSubmitted}
          isSubmitting={formState.isSubmitting}
          isValid={!formState.errors.password}
          hint={formState.errors.password?.message}
          {...register('password')}
          required
        />
        <TextInput
          size="lg"
          type="password"
          label={t('input.label.confirm-password')}
          placeholder={t('input.placeholder.confirm-password')}
          isSubmitted={formState.isSubmitted}
          isSubmitting={formState.isSubmitting}
          isValid={!formState.errors.confirmPassword}
          hint={formState.errors.confirmPassword?.message}
          {...register('confirmPassword')}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="submit"
          className="btn btn-lg btn-primary"
          disabled={!formState.isValid}
        >
          {t('button.sign-up')}
        </button>
        <button
          type="button"
          className="btn btn-lg btn-secondary"
          onClick={router.back}
        >
          {t('button.back')}
        </button>
      </div>
    </form>
  );
};

export default SignUpWithEmailForm;
