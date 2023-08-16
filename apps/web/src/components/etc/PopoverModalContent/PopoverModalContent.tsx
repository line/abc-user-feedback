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
import {
  IIconProps,
  Icon,
  PopoverContent,
  PopoverHeading,
  usePopoverContext,
} from '@ufb/ui';
import { useTranslation } from 'react-i18next';

export interface IDialogProps extends React.PropsWithChildren {
  title: string;
  description?: string;
  icon?: IIconProps;
  submitButton: {
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
    form?: string;
    type?: 'submit' | 'reset' | 'button' | undefined;
  };
}

const PopoverModalContent: React.FC<IDialogProps> = (props) => {
  const { title, description, children, submitButton, icon } = props;
  const { t } = useTranslation();
  const { setOpen } = usePopoverContext();
  return (
    <PopoverContent isPortal>
      <PopoverHeading>{title}</PopoverHeading>
      <div className="m-5 w-[400px]">
        {icon && (
          <div className="text-center mb-6">
            <Icon {...icon} />
          </div>
        )}
        {description && (
          <p
            className={[
              'font-14-regular mb-10 whitespace-pre-line',
              icon ? 'text-center' : '',
            ].join(' ')}
          >
            {description}
          </p>
        )}
        <div className="mb-5">{children}</div>
        <div className="flex justify-end gap-2">
          <button className="btn btn-secondary" onClick={() => setOpen(false)}>
            {t('button.cancel')}
          </button>
          <button
            {...submitButton}
            className={['btn btn-primary', submitButton.className].join(' ')}
            type={submitButton.type || 'button'}
          />
        </div>
      </div>
    </PopoverContent>
  );
};
export default PopoverModalContent;
