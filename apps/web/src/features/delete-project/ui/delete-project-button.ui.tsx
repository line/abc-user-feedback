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

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogIcon,
  DialogTitle,
  DialogTrigger,
} from '@ufb/react';

interface IProps {
  disabled?: boolean;
  onClickDelete: () => void;
  loading?: boolean;
}

const DeleteProjectButton: React.FC<IProps> = (props) => {
  const { onClickDelete, disabled = false, loading } = props;
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" iconL="RiDeleteBinFill" disabled={disabled}>
          {t('v2.button.name.delete', { name: 'Project' })}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogIcon name="RiErrorWarningFill" variant="error" />
          <DialogTitle>{t('v2.dialog.delete-project.title')}</DialogTitle>
          <DialogDescription>
            {t('v2.dialog.delete-project.description')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t('button.cancel')}</Button>
          </DialogClose>
          <Button
            variant="destructive"
            size="small"
            onClick={() => onClickDelete()}
            loading={loading}
          >
            {t('v2.button.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProjectButton;
