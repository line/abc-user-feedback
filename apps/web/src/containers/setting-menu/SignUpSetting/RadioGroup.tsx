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
  name: string;
  radios: {
    checked: boolean;
    onChecked: (iChecked: boolean) => void;
    label: string;
  }[];
}

const RadioGroup: React.FC<IProps> = ({ name, radios }) => {
  return (
    <div className="flex gap-10 mb-4">
      {radios.map((radio, index) => (
        <label key={index} className="radio-label">
          <input
            name={name}
            type="radio"
            className="radio radio-sm"
            checked={radio.checked}
            onChange={(e) => radio.onChecked(e.currentTarget.checked)}
          />
          {radio.label}
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
