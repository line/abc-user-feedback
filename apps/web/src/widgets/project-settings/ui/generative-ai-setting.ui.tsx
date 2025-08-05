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

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { Menu, MenuItem, toast } from '@ufb/react';

import { SettingTemplate, useOAIQuery } from '@/shared';
import {
  AIFieldTemplateForm,
  AIFieldTemplateSetting,
  AIIssueForm,
  AIIssueFormButton,
  AiIssueSetting,
  AISettingForm,
  AISettingFormButton,
  AITemplateFormButton,
  AIUsageForm,
  AIUsageFormButton,
} from '@/features/update-ai-setting';

type SubMenuType =
  | 'setting'
  | 'usage'
  | 'field-template'
  | 'field-template-form'
  | 'ai-issue'
  | 'ai-issue-form';

const GenerativeAiSetting = ({ projectId }: { projectId: number }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const subMenu = (router.query.subMenu ?? 'setting') as SubMenuType;

  const setSubMenu = async (subMenu: SubMenuType, templateId?: number) => {
    await router.push({
      pathname: router.pathname,
      query: { ...router.query, subMenu, templateId },
    });
  };
  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/integrations',
    variables: { projectId },
  });
  const isSettingsEmpty = !data || data.apiKey === '';
  useEffect(() => {
    if (!data) return;
    if (data.apiKey === '') {
      void setSubMenu('setting');
    }
  }, [data]);

  return (
    <>
      <SettingTemplate
        title={
          subMenu === 'field-template-form' ? 'Template Details'
          : subMenu === 'ai-issue-form' ?
            'AI Issue Recommend Details'
          : t('v2.project-setting-menu.generative-ai-setting')
        }
        action={
          <>
            {subMenu === 'setting' && <AISettingFormButton />}
            {subMenu === 'usage' && <AIUsageFormButton />}
            {subMenu === 'field-template-form' && (
              <AITemplateFormButton projectId={projectId} />
            )}
            {subMenu === 'ai-issue-form' && (
              <AIIssueFormButton projectId={projectId} />
            )}
          </>
        }
        onClickBack={
          subMenu === 'field-template-form' ? () => setSubMenu('field-template')
          : subMenu === 'ai-issue-form' ?
            () => setSubMenu('ai-issue')
          : undefined
        }
      >
        {subMenu !== 'field-template-form' && subMenu !== 'ai-issue-form' && (
          <Menu
            type="single"
            orientation="horizontal"
            value={subMenu}
            onValueChange={async (v) => {
              if (!v) return;
              if (isSettingsEmpty && v !== 'setting') {
                toast.warning('Please set up AI settings first.');
                return;
              }
              await setSubMenu(v as SubMenuType);
            }}
          >
            <MenuItem className="w-fit shrink-0" value="setting">
              AI Setting
            </MenuItem>
            <MenuItem className="w-fit shrink-0" value="usage">
              AI Usage
            </MenuItem>
            <MenuItem className="w-fit shrink-0" value="field-template">
              AI Field Template
            </MenuItem>
            <MenuItem className="w-fit shrink-0" value="ai-issue">
              AI Issue Recommendation
            </MenuItem>
          </Menu>
        )}
        <div className="flex h-full flex-col gap-4 overflow-auto">
          {subMenu === 'setting' && <AISettingForm projectId={projectId} />}
          {subMenu === 'usage' && <AIUsageForm projectId={projectId} />}
          {subMenu === 'field-template' && (
            <AIFieldTemplateSetting
              projectId={projectId}
              onClick={(id) => setSubMenu('field-template-form', id)}
            />
          )}
          {subMenu === 'field-template-form' && (
            <AIFieldTemplateForm projectId={projectId} />
          )}
          {subMenu === 'ai-issue' && (
            <AiIssueSetting
              projectId={projectId}
              onClick={(id) => setSubMenu('ai-issue-form', id)}
            />
          )}
          {subMenu === 'ai-issue-form' && <AIIssueForm projectId={projectId} />}
        </div>
      </SettingTemplate>
    </>
  );
};

export default GenerativeAiSetting;
