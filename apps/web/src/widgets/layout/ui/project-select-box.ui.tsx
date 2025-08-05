/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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
import { useTranslation } from 'next-i18next';

import {
  Icon,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ufb/react';

import { cn, CreatingDialog, Path, useAllProjects } from '@/shared';
import { useUserStore } from '@/entities/user';
import { useCreateProjectStore } from '@/features/create-project/create-project-model';

interface IProps {
  projectId?: number;
}
const ProjectSelectBox: React.FC<IProps> = ({ projectId }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const { editingStepIndex, reset, jumpStepByIndex } = useCreateProjectStore();

  const overlay = useOverlay();
  const { user } = useUserStore();

  const { data } = useAllProjects();

  const onChangeProject = async (currentProjectId?: string) => {
    if (router.pathname.includes('projectId')) {
      await router.push({
        pathname: router.pathname,
        query: { projectId: currentProjectId },
      });
    } else {
      await router.push({
        pathname: Path.DASHBOARD,
        query: { projectId: currentProjectId },
      });
    }
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
    <Tooltip open={!projectId}>
      <Select
        value={projectId ? String(projectId) : ''}
        onValueChange={(value) => onChangeProject(value)}
      >
        <TooltipTrigger asChild>
          <SelectTrigger className="min-w-60">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
        </TooltipTrigger>
        <SelectContent maxHeight="300px">
          <SelectGroup>
            {data?.items.map(({ id, name }) => (
              <SelectItem key={id} value={String(id)}>
                {name}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <button
            className={cn('select-item text-tint-blue select-item-left p-2', {
              'cursor-auto opacity-50': user?.type !== 'SUPER',
            })}
            onClick={openCreateProjectDialog}
            disabled={user?.type !== 'SUPER'}
          >
            <span className="select-item-check select-item-check-left">
              <Icon name="RiAddCircleFill" size={16} />
            </span>
            <div className="flex w-[215px] items-center justify-between gap-2">
              <span>{t('v2.text.create-project')}</span>
              {editingStepIndex !== null && (
                <span className="text-tint-red">
                  {t('v2.text.in-progress')}
                </span>
              )}
            </div>
          </button>
        </SelectContent>
      </Select>
      <TooltipContent>{t('v2.text.select-project')}</TooltipContent>
    </Tooltip>
  );
};

export default ProjectSelectBox;
