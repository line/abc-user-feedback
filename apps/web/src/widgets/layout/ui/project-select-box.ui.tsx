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
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'react-i18next';

import {
  Icon,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@ufb/react';

import { CreatingDialog, Path, useOAIQuery } from '@/shared';
import { useCreateProjectStore } from '@/features/create-project/create-project-model';

interface IProps {
  projectId?: number;
}

const ProjectSelectBox: React.FC<IProps> = ({ projectId }) => {
  console.log('projectId: ', projectId);
  const router = useRouter();
  const { t } = useTranslation();

  const { editingStepIndex, reset, jumpStepByIndex } = useCreateProjectStore();
  const overlay = useOverlay();

  const { data } = useOAIQuery({ path: '/api/admin/projects' });

  const onChangeProject = async (currentProjectId: string) => {
    await router.push({
      pathname: `/main/project/[projectId]/settings`,
      query: { projectId: currentProjectId },
    });
  };

  const openCreateProjectDialog = async () => {
    if (editingStepIndex !== null) {
      await new Promise<boolean>((resolve) =>
        overlay.open(({ close, isOpen }) => (
          <CreatingDialog
            isOpen={isOpen}
            close={close}
            type="Project"
            onRestart={() => {
              reset();
              resolve(true);
            }}
            onContinue={() => {
              jumpStepByIndex(editingStepIndex);
              resolve(true);
            }}
          />
        )),
      );
    }
    await router.push(Path.CREATE_PROJECT);
  };

  return (
    <Select
      type="single"
      value={projectId ? String(projectId) : undefined}
      onValueChange={(value) => onChangeProject(value)}
    >
      <SelectTrigger className="min-w-60">
        <SelectValue placeholder="123" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {data?.items.map(({ id, name }) => (
            <SelectItem key={id} value={String(id)}>
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectSeparator />
        <div
          className="select-item text-tint-blue select-item-left p-2"
          onClick={openCreateProjectDialog}
        >
          <span className="select-item-check select-item-check-left">
            <Icon name="RiAddCircleFill" size={16} />
          </span>
          <div className="flex w-[215px] items-center justify-between gap-2">
            <span>{t('v2.text.create-project')}</span>
            {editingStepIndex !== null && (
              <span className="text-tint-red">{t('v2.text.in-progress')}</span>
            )}
          </div>
        </div>
        {/* <SelectItem
          value="0"
          icon="RiAddCircleFill"
          className="text-tint-blue p-2"
        >
          <div className="flex w-[215px] items-center justify-between gap-2">
            <span>{t('v2.text.create-project')}</span>
            {editingStepIndex !== null && (
              <span className="text-tint-red">{t('v2.text.in-progress')}</span>
            )}
          </div>
        </SelectItem> */}
      </SelectContent>
    </Select>
  );
};

export default ProjectSelectBox;
