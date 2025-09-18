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
import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { getMockProvider, MockDataSource } from '@/test-utils/util-functions';
import type { GetAllMemberRequestDto } from './dtos/requests';
import type { CreateMemberRequestDto } from './dtos/requests/create-member-request.dto';
import type { DeleteManyMemberRequestDto } from './dtos/requests/delete-many-member-request.dto';
import type { UpdateMemberRequestDto } from './dtos/requests/update-member-request.dto';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

const MockMemberService = {
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
};

describe('MemberController', () => {
  let memberController: MemberController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        getMockProvider(MemberService, MockMemberService),
        getMockProvider(DataSource, MockDataSource),
      ],
    }).compile();

    memberController = module.get(MemberController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchMembers', () => {
    it('should call memberService.findAll with correct parameters', async () => {
      const projectId = faker.number.int();
      const requestDto: GetAllMemberRequestDto = {
        limit: 10,
        page: 1,
        queries: [
          {
            key: 'name',
            value: 'test',
            condition: 'LIKE' as any,
          },
        ],
        operator: 'AND',
      };

      const mockResponse = {
        items: [],
        meta: {
          itemCount: 0,
          totalItems: 0,
          itemsPerPage: 10,
          currentPage: 1,
          totalPages: 0,
        },
      };

      MockMemberService.findAll.mockResolvedValue(mockResponse);

      const result = await memberController.searchMembers(
        projectId,
        requestDto,
      );

      expect(MockMemberService.findAll).toHaveBeenCalledWith({
        options: { limit: requestDto.limit, page: requestDto.page },
        queries: requestDto.queries,
        operator: requestDto.operator,
        projectId,
      });
      expect(result).toBeDefined();
    });

    it('should handle search without queries and operator', async () => {
      const projectId = faker.number.int();
      const requestDto: GetAllMemberRequestDto = {
        limit: 20,
        page: 2,
      };

      const mockResponse = {
        items: [],
        meta: {
          itemCount: 0,
          totalItems: 0,
          itemsPerPage: 20,
          currentPage: 2,
          totalPages: 0,
        },
      };

      MockMemberService.findAll.mockResolvedValue(mockResponse);

      await memberController.searchMembers(projectId, requestDto);

      expect(MockMemberService.findAll).toHaveBeenCalledWith({
        options: { limit: requestDto.limit, page: requestDto.page },
        queries: undefined,
        operator: undefined,
        projectId,
      });
    });
  });

  describe('create', () => {
    it('should call memberService.create with correct parameters', async () => {
      const requestDto: CreateMemberRequestDto = {
        userId: faker.number.int(),
        roleId: faker.number.int(),
      };

      MockMemberService.create.mockResolvedValue(undefined);

      await memberController.create(requestDto);

      expect(MockMemberService.create).toHaveBeenCalledWith(requestDto);
      expect(MockMemberService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should call memberService.update with correct parameters', async () => {
      const memberId = faker.number.int();
      const requestDto: UpdateMemberRequestDto = {
        roleId: faker.number.int(),
      };

      MockMemberService.update.mockResolvedValue(undefined);

      await memberController.update(memberId, requestDto);

      expect(MockMemberService.update).toHaveBeenCalledWith({
        ...requestDto,
        memberId,
      });
      expect(MockMemberService.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should call memberService.delete with correct memberId', async () => {
      const memberId = faker.number.int();

      MockMemberService.delete.mockResolvedValue(undefined);

      await memberController.delete(memberId);

      expect(MockMemberService.delete).toHaveBeenCalledWith(memberId);
      expect(MockMemberService.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteMany', () => {
    it('should call memberService.deleteMany with correct parameters', async () => {
      const requestDto: DeleteManyMemberRequestDto = {
        memberIds: [faker.number.int(), faker.number.int(), faker.number.int()],
      };

      MockMemberService.deleteMany.mockResolvedValue(undefined);

      await memberController.deleteMany(requestDto);

      expect(MockMemberService.deleteMany).toHaveBeenCalledWith(requestDto);
      expect(MockMemberService.deleteMany).toHaveBeenCalledTimes(1);
    });

    it('should handle empty memberIds array', async () => {
      const requestDto: DeleteManyMemberRequestDto = {
        memberIds: [],
      };

      MockMemberService.deleteMany.mockResolvedValue(undefined);

      await memberController.deleteMany(requestDto);

      expect(MockMemberService.deleteMany).toHaveBeenCalledWith(requestDto);
      expect(MockMemberService.deleteMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    it('should propagate errors from memberService.findAll', async () => {
      const projectId = faker.number.int();
      const requestDto: GetAllMemberRequestDto = {
        limit: 10,
        page: 1,
      };

      const error = new Error('Service error');
      MockMemberService.findAll.mockRejectedValue(error);

      await expect(
        memberController.searchMembers(projectId, requestDto),
      ).rejects.toThrow('Service error');
    });

    it('should propagate errors from memberService.create', async () => {
      const requestDto: CreateMemberRequestDto = {
        userId: faker.number.int(),
        roleId: faker.number.int(),
      };

      const error = new Error('Create error');
      MockMemberService.create.mockRejectedValue(error);

      await expect(memberController.create(requestDto)).rejects.toThrow(
        'Create error',
      );
    });

    it('should propagate errors from memberService.update', async () => {
      const memberId = faker.number.int();
      const requestDto: UpdateMemberRequestDto = {
        roleId: faker.number.int(),
      };

      const error = new Error('Update error');
      MockMemberService.update.mockRejectedValue(error);

      await expect(
        memberController.update(memberId, requestDto),
      ).rejects.toThrow('Update error');
    });

    it('should propagate errors from memberService.delete', async () => {
      const memberId = faker.number.int();

      const error = new Error('Delete error');
      MockMemberService.delete.mockRejectedValue(error);

      await expect(memberController.delete(memberId)).rejects.toThrow(
        'Delete error',
      );
    });

    it('should propagate errors from memberService.deleteMany', async () => {
      const requestDto: DeleteManyMemberRequestDto = {
        memberIds: [faker.number.int()],
      };

      const error = new Error('Delete many error');
      MockMemberService.deleteMany.mockRejectedValue(error);

      await expect(memberController.deleteMany(requestDto)).rejects.toThrow(
        'Delete many error',
      );
    });
  });
});
