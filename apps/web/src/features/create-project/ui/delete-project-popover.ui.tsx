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
import { useTranslation } from 'react-i18next';

import {
  Popover,
  PopoverModalContent,
  PopoverTrigger,
  TextInput,
} from '@ufb/ui';

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
  const [open, setOpen] = useState(false);
  const [inputChannelName, setInputChannelName] = useState('');

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="btn btn-md btn-primary min-w-[120px]"
        onClick={() => setOpen(true)}
        disabled={!perms.includes('project_delete')}
      >
        {t('button.delete')}
      </PopoverTrigger>
      <PopoverModalContent
        title={t('main.setting.dialog.delete-project.title')}
        cancelButton={{ children: t('button.cancel') }}
        description={t('main.setting.dialog.delete-project.description')}
        icon={{
          name: 'WarningTriangleFill',
          className: 'text-red-primary',
          size: 56,
        }}
        submitButton={{
          children: t('button.delete'),
          disabled: inputChannelName !== project.name,
          className: 'btn-red',
          onClick: () => onClickDelete(project.id),
        }}
      >
        <p className="font-16-bold mb-3 text-center">{project.name}</p>
        <TextInput
          placeholder={t('input.placeholder.input')}
          onChange={(e) => setInputChannelName(e.target.value)}
        />
      </PopoverModalContent>
    </Popover>
  );
};

export default DeleteProjectPopover;
