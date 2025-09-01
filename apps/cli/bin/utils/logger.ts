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
import { format } from 'date-fns';

/**
 * Log levels enumeration
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Logger configuration type
 */
export interface LoggerConfig {
  level?: LogLevel;
  showTimestamp?: boolean;
}

/**
 * Logger class for handling application logs
 */
export class Logger {
  private level: LogLevel;
  private showTimestamp: boolean;

  constructor(
    config: LoggerConfig = { level: LogLevel.INFO, showTimestamp: false },
  ) {
    this.level = config.level ?? LogLevel.INFO;
    this.showTimestamp = config.showTimestamp !== false;
  }

  /**
   * Format log message with timestamp
   */
  private formatMessage(message: string): string {
    if (this.showTimestamp) {
      const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      return `[${timestamp}] ${message}`;
    }
    return message;
  }

  /**
   * Check if the given log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = Object.values(LogLevel);
    const currentLevelIndex = levels.indexOf(this.level);
    const targetLevelIndex = levels.indexOf(level);
    return targetLevelIndex >= currentLevelIndex;
  }

  /**
   * Log debug message
   */
  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage(message), ...args);
    }
  }

  /**
   * Log info message
   */
  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(this.formatMessage(message), ...args);
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.log(this.formatMessage(message), ...args);
    }
  }

  /**
   * Log error message
   */
  error(message: string | Error, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      if (message instanceof Error) {
        console.error(this.formatMessage(message.message), ...args);
        if (message.stack) {
          console.error(message.stack);
        }
      } else {
        console.error(this.formatMessage(message), ...args);
      }
    }
  }

  /**
   * Create a new logger with the specified configuration
   */
  static create(config?: LoggerConfig): Logger {
    return new Logger(config);
  }
}

// Export default logger instance with INFO level
export default Logger.create();
