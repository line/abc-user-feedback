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
import { useTranslation } from 'react-i18next';

import { SIGN_IN_WITH_EMAIL_FORM_ID } from '../sign-in-with-email.constant';

interface IProps {}

const SignInWithEmailButton: React.FC<IProps> = () => {
  const { t } = useTranslation();
  return (
    <button
      type="submit"
      form={SIGN_IN_WITH_EMAIL_FORM_ID}
      className="btn btn-lg btn-primary"
    >
      {t('button.sign-in')}
    </button>
  );
};

export default SignInWithEmailButton;
