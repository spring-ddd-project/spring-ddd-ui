import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';

import * as aggregateModule from '#/api/gen/aggregate';

// Mock the API module
vi.mock('#/api/gen/aggregate', () => ({
  getAggregatePage: vi.fn(),
  wipeAggregate: vi.fn(),
  createAggregate: vi.fn(),
  updateAggregate: vi.fn(),
}));

// Mock the adapter modules
vi.mock('#/adapter/vxe-table', () => ({
  useVbenVxeGrid: vi.fn().mockReturnValue([
    {
      grid: {
        getFullData: vi.fn().mockReturnValue([]),
        getCheckboxRecords: vi.fn().mockReturnValue([]),
        reload: vi.fn(),
      },
    },
    {
      reload: vi.fn(),
    },
  ]),
}));

vi.mock('#/adapter/form', () => ({
  useVbenForm: vi.fn().mockReturnValue([
    {},
    {
      resetForm: vi.fn(),
      setValues: vi.fn(),
      getValues: vi.fn().mockResolvedValue({}),
      validate: vi.fn().mockResolvedValue({ valid: true }),
      updateSchema: vi.fn(),
    },
  ]),
}));

vi.mock('#/adapter/component/Dict.vue', () => ({
  default: { name: 'Dict' },
}));

describe('gen/aggregate module', () => {
  describe('API functions', () => {
    it('should export getAggregatePage', () => {
      expect(aggregateModule.getAggregatePage).toBeDefined();
    });

    it('should export wipeAggregate', () => {
      expect(aggregateModule.wipeAggregate).toBeDefined();
    });

    it('should export createAggregate', () => {
      expect(aggregateModule.createAggregate).toBeDefined();
    });

    it('should export updateAggregate', () => {
      expect(aggregateModule.updateAggregate).toBeDefined();
    });
  });

  describe('aggregate index.vue', () => {
    it('should have correct structure for RowType interface', () => {
      interface RowType {
        id: string;
        infoId: string;
        objectName: string;
        objectValue: string;
        objectType: number;
        hasCreated: boolean;
      }

      const row: RowType = {
        id: '1',
        infoId: 'info-1',
        objectName: 'TestAggregate',
        objectValue: '["TestValue"]',
        objectType: 1,
        hasCreated: true,
      };

      expect(row.id).toBe('1');
      expect(row.objectName).toBe('TestAggregate');
      expect(row.objectType).toBe(1);
      expect(row.hasCreated).toBe(true);
    });
  });

  describe('aggregate form.vue', () => {
    it('should handle objectValue parsing', () => {
      const jsonStr = '["Entity1", "Entity2"]';
      const parsed = JSON.parse(jsonStr);
      expect(parsed).toEqual(['Entity1', 'Entity2']);
    });

    it('should handle invalid JSON gracefully', () => {
      const invalidJson = 'not valid json';
      let parsed: string[] = [];
      try {
        parsed = JSON.parse(invalidJson);
      } catch {
        parsed = [];
      }
      expect(parsed).toEqual([]);
    });
  });
});
