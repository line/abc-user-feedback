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
import { toast } from '@ufb/ui';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@/components';
import { useOAIMutation } from '@/hooks';

interface IProps {
  open: boolean;
  close: () => void;
  projectId: number;
  channelId: number;
  rowSelectionIds: number[];
  handleSuccess: () => Promise<void>;
}

const FeedbackDeleteDialog: React.FC<IProps> = (props) => {
  const { close, open, channelId, projectId, handleSuccess, rowSelectionIds } =
    props;

  const { t } = useTranslation();

  const { mutate: deleteFeedback, isLoading: deleteFeedbackLoading } =
    useOAIMutation({
      method: 'delete',
      path: '/api/projects/{projectId}/channels/{channelId}/feedbacks',
      pathParams: { projectId, channelId },
      queryOptions: {
        async onSuccess() {
          await handleSuccess();
          close();
        },
        onError(error) {
          toast.negative({ title: error?.message ?? 'Error' });
        },
      },
    });

  const onClickDelete = () => {
    deleteFeedback({ feedbackIds: rowSelectionIds });
  };

  return (
    <Dialog
      open={open}
      close={close}
      title={t('main.feedback.dialog.delete-feedback.title')}
      description={t('main.feedback.dialog.delete-feedback.description')}
      submitButton={{
        onClick: onClickDelete,
        children: t('button.delete'),
        disabled: deleteFeedbackLoading,
      }}
      icon={{
        name: 'WarningCircleFill',
        className: 'text-red-primary',
        size: 56,
      }}
    />
  );
};

export default FeedbackDeleteDialog;
