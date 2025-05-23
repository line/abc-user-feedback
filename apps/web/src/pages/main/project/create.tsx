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
import { useEffect } from 'react';
import type { GetStaticProps, NextPage } from 'next';
import { useOverlay } from '@toss/use-overlay';

import { NoProjectDialogInProjectCreation, useAllProjects } from '@/shared';
import { CreateProject } from '@/features/create-project';

import serverSideTranslations from '@/server-side-translations';

const CreateProjectPage: NextPage = () => {
  const overlay = useOverlay();

  const { data } = useAllProjects();
  const openWarningNoProjects = () => {
    overlay.open(({ close, isOpen }) => (
      <NoProjectDialogInProjectCreation isOpen={isOpen} close={close} />
    ));
  };

  useEffect(() => {
    if (!data || data.items.length > 0) return;
    openWarningNoProjects();
  }, [data]);

  return <CreateProject />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
};

export default CreateProjectPage;
