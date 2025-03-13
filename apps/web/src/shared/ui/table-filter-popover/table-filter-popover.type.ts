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
export type TableFilterFieldFotmat = TableFilterField['format'];

export type TableFilterCondition = 'CONTAINS' | 'IS' | 'BETWEEN';
export type TableFilterOperator = 'AND' | 'OR';

export type TableFilterField = {
  key: string;
  name: string;
  visible?: boolean;
} & (
  | TableFilterFieldString
  | TableFilterFieldNumber
  | TableFilterFieldDate
  | TableFilterFieldSelect
  | TableFilterFieldMultiSelect
  | TableFilterFieldTicket
  | TableFilterFieldIssue
);

export interface TableFilterFieldString {
  format: 'string';
  matchType: ('IS' | 'CONTAINS')[];
}
export interface TableFilterFieldNumber {
  format: 'number';
  matchType: 'IS'[];
}
export interface TableFilterFieldDate {
  format: 'date';
  matchType: ('IS' | 'BETWEEN')[];
}

export interface TableFilterFieldSelect {
  format: 'select';
  matchType: ('IS' | 'CONTAINS')[];
  options: { key: string | number; name: string }[];
}
export interface TableFilterFieldMultiSelect {
  format: 'multiSelect';
  matchType: ('IS' | 'CONTAINS')[];
  options: { key: string | number; name: string }[];
}

export interface TableFilterFieldTicket {
  format: 'ticket';
  matchType: 'IS'[];
  ticketKey?: string | null;
}

export interface TableFilterFieldIssue {
  format: 'issue';
  matchType: 'IS'[];
}

export interface TableFilter {
  value?: unknown;
  key: string;
  name: string;
  format: TableFilterFieldFotmat;
  condition: TableFilterCondition;
}
