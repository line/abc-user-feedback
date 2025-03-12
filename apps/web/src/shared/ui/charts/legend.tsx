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
interface IProps {
  dataKeys: { name: string; color: string }[];
}

const Legend: React.FC<IProps> = ({ dataKeys }) => {
  return (
    <div className="flex gap-2">
      {dataKeys.map((v, i) => (
        <div className="flex items-center gap-2" key={i}>
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: v.color }}
          />
          <p className="text-small-normal text-neutral-secondary">{v.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Legend;
