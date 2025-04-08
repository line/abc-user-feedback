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
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Path } from '@/shared';

interface IProps {}

const Logo: React.FC<IProps> = () => {
  const router = useRouter();
  return (
    <Link
      className="flex cursor-pointer items-center gap-1"
      href={Path.isProtectPage(router.pathname) ? Path.MAIN : Path.SIGN_IN}
    >
      <Image src="/assets/images/logo.svg" alt="logo" width={24} height={24} />
      <h1 className="text-title-h5">ABC User Feedback</h1>
    </Link>
  );
};

export default Logo;
