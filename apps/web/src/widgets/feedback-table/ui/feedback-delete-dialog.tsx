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

import { Popover, PopoverModalContent } from '@ufb/ui';

interface IProps {
  open: boolean;
  close: () => void;
  onClickDelete: () => void;
}

const FeedbackDeleteDialog: React.FC<IProps> = (props) => {
  const { close, open, onClickDelete } = props;

  const { t } = useTranslation();

  return (
    <Popover open={open} onOpenChange={close} modal>
      <PopoverModalContent
        title={t('main.feedback.dialog.delete-feedback.title')}
        description={t('main.feedback.dialog.delete-feedback.description')}
        cancelButton={{ children: t('button.cancel') }}
        submitButton={{
          onClick: onClickDelete,
          children: t('button.delete'),
        }}
        icon={{
          name: 'WarningCircleFill',
          className: 'text-red-primary',
          size: 56,
        }}
      />
    </Popover>
  );
};

export default FeedbackDeleteDialog;
