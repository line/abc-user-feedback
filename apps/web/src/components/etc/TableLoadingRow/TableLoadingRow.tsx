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
interface IProps extends React.PropsWithChildren {
  colSpan: number;
}

const TableLoadingRow: React.FC<IProps> = ({ colSpan }) => {
  return (
    <tr>
      <td colSpan={colSpan} style={{ padding: 0, height: 0 }}>
        <div className="relative w-full bg-gray-200 rounded">
          <div className={'top-0 h-1 rounded w-full relative loading'} />
        </div>
      </td>
    </tr>
  );
};

export default TableLoadingRow;
