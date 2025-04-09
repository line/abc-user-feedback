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
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Button } from '@ufb/react';

import { Path } from '@/shared';

const UnauthorizedPage: NextPage = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-6">
        <Image
          src="/assets/images/403.svg"
          alt="403"
          width={320}
          height={320}
        />
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-title-h3">Access restricted</h3>
          <p className="text-neutral-tertiary">
            You don’t have permission to access. please contact to owner and ask
            to you invite.
          </p>
        </div>
        <Button onClick={() => router.push(Path.MAIN)}>Home</Button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
