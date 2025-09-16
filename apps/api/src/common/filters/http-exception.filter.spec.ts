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
import type { ArgumentsHost } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockRequest: FastifyRequest;
  let mockResponse: FastifyReply;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);

    // Mock FastifyRequest
    mockRequest = {
      url: '/test-endpoint',
      method: 'GET',
      headers: {},
      query: {},
      params: {},
      body: {},
    } as FastifyRequest;

    // Mock FastifyReply
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as FastifyReply;

    // Mock ArgumentsHost
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as unknown as ArgumentsHost;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('catch', () => {
    it('should handle string exception response', () => {
      const exception = new HttpException(
        'Test error message',
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.send).toHaveBeenCalledWith({
        response: 'Test error message',
        path: '/test-endpoint',
      });
    });

    it('should handle object exception response', () => {
      const exceptionResponse = {
        message: 'Validation failed',
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      };
      const exception = new HttpException(
        exceptionResponse,
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'Validation failed',
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
        path: '/test-endpoint',
      });
    });

    it('should handle different HTTP status codes', () => {
      const statusCodes = [
        HttpStatus.UNAUTHORIZED,
        HttpStatus.FORBIDDEN,
        HttpStatus.NOT_FOUND,
        HttpStatus.INTERNAL_SERVER_ERROR,
      ];

      statusCodes.forEach((statusCode) => {
        const exception = new HttpException('Test error', statusCode);

        filter.catch(exception, mockArgumentsHost);

        expect(mockResponse.status).toHaveBeenCalledWith(statusCode);
        expect(mockResponse.send).toHaveBeenCalledWith({
          response: 'Test error',
          path: '/test-endpoint',
        });
      });
    });

    it('should handle complex object exception response', () => {
      const exceptionResponse = {
        message: ['Email is required', 'Password is too short'],
        error: 'Validation Error',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        details: {
          field: 'email',
          value: '',
        },
      };
      const exception = new HttpException(
        exceptionResponse,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: ['Email is required', 'Password is too short'],
        error: 'Validation Error',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        path: '/test-endpoint',
        details: {
          field: 'email',
          value: '',
        },
      });
    });

    it('should handle empty string exception response', () => {
      const exception = new HttpException('', HttpStatus.NO_CONTENT);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(mockResponse.send).toHaveBeenCalledWith({
        response: '',
        path: '/test-endpoint',
      });
    });

    it('should handle null exception response', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const exception = new HttpException(null as any, HttpStatus.NO_CONTENT);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(mockResponse.send).toHaveBeenCalledWith({
        statusCode: HttpStatus.NO_CONTENT,
        path: '/test-endpoint',
      });
    });

    it('should handle undefined exception response', () => {
      const exception = new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        undefined as any,
        HttpStatus.NO_CONTENT,
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(mockResponse.send).toHaveBeenCalledWith({
        statusCode: HttpStatus.NO_CONTENT,
        path: '/test-endpoint',
      });
    });

    it('should handle different request URLs', () => {
      const urls = [
        '/api/users',
        '/api/projects/123',
        '/api/auth/login',
        '/api/feedback?page=1&limit=10',
      ];

      urls.forEach((url) => {
        Object.assign(mockRequest, { url });
        const exception = new HttpException(
          'Test error',
          HttpStatus.BAD_REQUEST,
        );

        filter.catch(exception, mockArgumentsHost);

        expect(mockResponse.send).toHaveBeenCalledWith({
          response: 'Test error',
          path: url,
        });
      });
    });

    it('should handle nested object exception response', () => {
      const exceptionResponse = {
        message: 'Complex error',
        error: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        nested: {
          level1: {
            level2: {
              value: 'deep nested value',
            },
          },
        },
      };
      const exception = new HttpException(
        exceptionResponse,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'Complex error',
        error: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        path: '/test-endpoint',
        nested: {
          level1: {
            level2: {
              value: 'deep nested value',
            },
          },
        },
      });
    });

    it('should handle array exception response', () => {
      const exceptionResponse = ['Error 1', 'Error 2', 'Error 3'];
      const exception = new HttpException(
        exceptionResponse,
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.send).toHaveBeenCalledWith({
        0: 'Error 1',
        1: 'Error 2',
        2: 'Error 3',
        statusCode: HttpStatus.BAD_REQUEST,
        path: '/test-endpoint',
      });
    });

    it('should handle boolean exception response', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const exception = new HttpException(true as any, HttpStatus.OK);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith({
        statusCode: HttpStatus.OK,
        path: '/test-endpoint',
      });
    });

    it('should handle number exception response', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const exception = new HttpException(42 as any, HttpStatus.OK);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith({
        statusCode: HttpStatus.OK,
        path: '/test-endpoint',
      });
    });
  });
});
