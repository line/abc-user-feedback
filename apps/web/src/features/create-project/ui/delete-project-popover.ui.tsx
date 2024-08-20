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
  DialogTitle,
  DialogTrigger,
} from '@ufb/react';

import { usePermissions } from '@/shared';
import type { Project } from '@/entities/project';

interface IProps {
  project: Project;
  onClickDelete: (projectId: number) => void;
}

const DeleteProjectPopover: React.FC<IProps> = (props) => {
  const { project, onClickDelete } = props;
  const { t } = useTranslation();
  const perms = usePermissions(project.id);

  return (
    <Dialog>
      <DialogTrigger disabled={!perms.includes('project_delete')}>
        <Button>{t('button.delete')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader icon="RiCloseCircleFill">
          <DialogTitle>
            {t('main.setting.dialog.delete-project.title')}
          </DialogTitle>
          <DialogDescription>
            {t('main.setting.dialog.delete-project.description')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">{t('button.cancel')}</Button>
          </DialogClose>
          <Button
            variant="destructive"
            size="small"
            onClick={() => onClickDelete(project.id)}
          >
            {t('button.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProjectPopover;
