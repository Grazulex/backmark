import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { logger } from '../../src/utils/logger';

describe('logger', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    delete process.env.DEBUG;
  });

  describe('info', () => {
    it('should log info message with info icon', () => {
      logger.info('This is an info message');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('ℹ'),
        'This is an info message'
      );
    });
  });

  describe('success', () => {
    it('should log success message with check icon', () => {
      logger.success('Operation succeeded');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('✓'),
        'Operation succeeded'
      );
    });
  });

  describe('warning', () => {
    it('should log warning message with warning icon', () => {
      logger.warning('This is a warning');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('⚠'),
        'This is a warning'
      );
    });
  });

  describe('error', () => {
    it('should log error message with error icon', () => {
      logger.error('An error occurred');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('✗'),
        'An error occurred'
      );
    });
  });

  describe('debug', () => {
    it('should not log debug message when DEBUG is not set', () => {
      logger.debug('Debug message');

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should log debug message when DEBUG is set', () => {
      process.env.DEBUG = 'true';

      logger.debug('Debug message');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]'),
        'Debug message'
      );
    });

    it('should log debug message when DEBUG is set to any truthy value', () => {
      process.env.DEBUG = '1';

      logger.debug('Another debug message');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]'),
        'Another debug message'
      );
    });
  });

  describe('multiple log calls', () => {
    it('should handle multiple log calls correctly', () => {
      logger.info('First message');
      logger.success('Second message');
      logger.warning('Third message');
      logger.error('Fourth message');

      expect(consoleLogSpy).toHaveBeenCalledTimes(4);
    });

    it('should handle empty messages', () => {
      logger.info('');
      logger.success('');
      logger.warning('');
      logger.error('');

      expect(consoleLogSpy).toHaveBeenCalledTimes(4);
    });

    it('should handle multi-line messages', () => {
      const multiLineMessage = 'Line 1\nLine 2\nLine 3';

      logger.info(multiLineMessage);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('ℹ'),
        multiLineMessage
      );
    });

    it('should handle messages with special characters', () => {
      const specialMessage = 'Message with special chars: @#$%^&*()';

      logger.info(specialMessage);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('ℹ'),
        specialMessage
      );
    });
  });
});
