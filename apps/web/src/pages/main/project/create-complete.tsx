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
import React, { useMemo } from 'react';
import type { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Icon } from '@ufb/ui';

import { DEFAULT_LOCALE } from '@/constants/i18n';
import { Path } from '@/constants/path';
import {
  ApiKeySection,
  IssueTrackerSection,
  MemberSection,
  ProjectInfoSection,
  RoleSection,
} from '@/containers/create-project-complete';
import { useOAIQuery } from '@/hooks';

const CreateCompletePage: NextPage = () => {
  const router = useRouter();
  const { projectId } = useMemo(
    () => ({
      projectId: Number(router.query.projectId),
    }),
    [router.query],
  );

  const { data } = useOAIQuery({
    path: '/api/projects/{projectId}',
    variables: { projectId },
  });

  return (
    <div className="m-auto flex min-h-screen w-[1040px] flex-col gap-4 pb-6">
      <Header />
      <div className="flex flex-col items-center gap-3 py-6">
        <Icon
          name="Check"
          size={48}
          className="bg-blue-primary text-above-primary rounded-full"
        />
        <p className="font-20-bold">프로젝트 생성이 완료되었습니다.</p>
      </div>
      {data && (
        <>
          <ProjectInfoSection {...data} />
          <RoleSection projectId={projectId} />
          <MemberSection projectId={projectId} />
          <ApiKeySection projectId={projectId} />
          <IssueTrackerSection projectId={projectId} />
        </>
      )}
      <div className="border-fill-tertiary flex rounded border p-6">
        <div className="flex flex-1 items-center gap-2.5">
          <Icon
            name="InfoCircleFill"
            size={24}
            className="text-green-primary"
          />
          <p className="font-12-regular">
            Channel까지 생성해야 UserFeedback을 사용할 수 있습니다.
            <br />
            Channel 생성을 이어서 하시겠어요?
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-lg btn-secondary w-[160px]"
            onClick={() => {
              router.push({ pathname: Path.MAIN });
            }}
          >
            다음에
          </button>
          <button
            className="btn btn-lg btn-blue w-[160px]"
            onClick={() => {
              router.push({
                pathname: Path.CREATE_CHANNEL,
                query: { projectId },
              });
            }}
          >
            Channel 생성
          </button>
        </div>
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  const router = useRouter();
  return (
    <div className="flex h-12 items-center justify-between">
      <div className="flex items-center gap-1">
        <Image
          src="/assets/images/logo.svg"
          alt="logo"
          width={24}
          height={24}
        />
        <Icon name="Title" className="h-[24px] w-[123px]" />
      </div>
      <button
        className="btn btn-sm btn-secondary min-w-0 gap-1 px-2"
        onClick={() => router.push(Path.MAIN)}
      >
        <Icon name="Out" size={16} />
        <span className="font-12-bold uppercase">나가기</span>
      </button>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default CreateCompletePage;
