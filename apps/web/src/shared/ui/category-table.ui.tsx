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

import { useOAIQuery } from '../lib';
import CategoryTableRow from './category-table-row.ui';

interface Props {
  projectId: number;
}

const CategoryTable = (props: Props) => {
  const { projectId } = props;

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/categories',
    variables: { projectId },
  });

  return (
    <div>
      {data?.items.map((item) => (
        <CategoryTableRow key={item.id} category={item} projectId={projectId} />
      ))}
    </div>
  );
};

export default CategoryTable;
