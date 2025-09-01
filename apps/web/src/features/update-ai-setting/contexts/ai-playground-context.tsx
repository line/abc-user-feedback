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

import { createContext, useContext, useState } from 'react';

import type { PlaygroundInputItem } from '../playground-input-item.schema';

export interface AIPlaygroundContextValue {
  inputItems: PlaygroundInputItem[];
  updateInputItem: (id: string, item: PlaygroundInputItem) => void;
  deleteInputItem: (id: string) => void;
  addNewEditingItem: () => void;
}

export const AIPlaygroundContext = createContext<AIPlaygroundContextValue>({
  inputItems: [],
  updateInputItem: () => {
    // Empty function for default context
  },
  deleteInputItem: () => {
    // Empty function for default context
  },
  addNewEditingItem: () => {
    // Empty function for default context
  },
});

export const AIPlaygroundContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [inputItems, setInputItems] = useState<PlaygroundInputItem[]>([]);

  const updateInputItem = (id: string, item: PlaygroundInputItem) => {
    setInputItems((prev) =>
      prev.map((prevItem) => (prevItem.id === id ? item : prevItem)),
    );
  };

  const deleteInputItem = (id: string) => {
    setInputItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addNewEditingItem = () => {
    setInputItems((prev) => [
      {
        name: '',
        description: '',
        value: '',
        isEditing: true,
        id: crypto.randomUUID(),
      },
      ...prev,
    ]);
  };

  return (
    <AIPlaygroundContext.Provider
      value={{
        deleteInputItem,
        inputItems,
        updateInputItem,
        addNewEditingItem,
      }}
    >
      {children}
    </AIPlaygroundContext.Provider>
  );
};

export const useAIPlayground = () => {
  return useContext(AIPlaygroundContext);
};
