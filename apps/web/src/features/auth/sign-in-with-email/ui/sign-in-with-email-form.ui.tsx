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

import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';

import { TextInput, toast } from '@ufb/ui';

import { useTenantState } from '@/entities/tenant';
import { useUserActions } from '@/entities/user';

import { SignInWithEmailSchema } from '../sign-in-with-email.schema';

import { Path } from '@/constants/path';
import type { IFetchError } from '@/types/fetch-error.type';

type FormType = z.infer<typeof SignInWithEmailSchema>;

interface IProps {}

const SignInWithEmailForm: React.FC<IProps> = () => {
  const tenant = useTenantState();
  const { t } = useTranslation();
  const router = useRouter();

  const { signInWithEmail } = useUserActions();
  const { handleSubmit, register, formState, setError } = useForm<FormType>({
    resolver: zodResolver(SignInWithEmailSchema),
  });

  const onSubmit = async (data: FormType) => {
    try {
      await signInWithEmail(data);
      toast.positive({ title: 'Success' });
    } catch (error) {
      const { message } = error as IFetchError;
      setError('email', { message: 'invalid email' });
      setError('password', { message: 'invalid password' });
      toast.negative({ title: 'Error', description: message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6 flex flex-col gap-3">
        <TextInput
          placeholder="ID"
          leftIconName="ProfileCircleFill"
          type="email"
          {...register('email')}
          isSubmitted={formState.isSubmitted}
          isSubmitting={formState.isSubmitting}
          isValid={!formState.errors.email}
          size="lg"
        />
        <TextInput
          placeholder="Password"
          leftIconName="LockFill"
          type="password"
          {...register('password')}
          isSubmitted={formState.isSubmitted}
          isSubmitting={formState.isSubmitting}
          isValid={!formState.errors.password}
          size="lg"
        />
      </div>
      <div className="flex flex-col gap-1">
        <button
          type="submit"
          className="btn btn-lg btn-primary"
          disabled={!formState.isValid}
        >
          {t('button.sign-in')}
        </button>
        {!tenant?.isPrivate && (
          <button
            type="button"
            className="btn btn-lg btn-secondary"
            onClick={() => router.push(Path.SIGN_UP)}
          >
            {t('button.sign-up')}
          </button>
        )}
      </div>
    </form>
  );
};

export default SignInWithEmailForm;
