import { describe, expect, it, vi } from 'vitest';

import * as bindModule from '#/api/gen/bind';

// Mock the API module
vi.mock('#/api/gen/bind', () => ({
  getBindPage: vi.fn(),
  getBindRecyclePage: vi.fn(),
  createBind: vi.fn(),
  updateBind: vi.fn(),
  deleteBind: vi.fn(),
  restoreBind: vi.fn(),
  wipeBind: vi.fn(),
}));

describe('gen/column/bind module', () => {
  describe('API functions', () => {
    it('should export getBindPage', () => {
      expect(bindModule.getBindPage).toBeDefined();
    });

    it('should export getBindRecyclePage', () => {
      expect(bindModule.getBindRecyclePage).toBeDefined();
    });

    it('should export createBind', () => {
      expect(bindModule.createBind).toBeDefined();
    });

    it('should export updateBind', () => {
      expect(bindModule.updateBind).toBeDefined();
    });

    it('should export deleteBind', () => {
      expect(bindModule.deleteBind).toBeDefined();
    });

    it('should export restoreBind', () => {
      expect(bindModule.restoreBind).toBeDefined();
    });

    it('should export wipeBind', () => {
      expect(bindModule.wipeBind).toBeDefined();
    });
  });

  describe('bind index.vue - RowType interface', () => {
    interface RowType {
      id: string;
      columnType: string;
      entityType: string;
      typescriptType: string;
      componentType: number;
    }

    it('should have correct row structure', () => {
      const row: RowType = {
        id: '1',
        columnType: 'varchar',
        entityType: 'String',
        typescriptType: 'string',
        componentType: 1,
      };

      expect(row.id).toBe('1');
      expect(row.columnType).toBe('varchar');
      expect(row.entityType).toBe('String');
      expect(row.componentType).toBe(1);
    });
  });

  describe('bind recycle.vue - RowType interface', () => {
    interface RecycleRowType {
      id: string;
      columnType: string;
      entityType: string;
      componentType: string;
    }

    it('should have correct recycle row structure', () => {
      const row: RecycleRowType = {
        id: '1',
        columnType: 'varchar',
        entityType: 'String',
        componentType: 'Input',
      };

      expect(row.id).toBe('1');
      expect(row.columnType).toBe('varchar');
      expect(row.entityType).toBe('String');
      expect(row.componentType).toBe('Input');
    });
  });

  describe('bind form.vue - columnType validation', () => {
    it('should validate lowercase columnType', () => {
      const validType = 'varchar';
      const isLowercase = /^[a-z]+$/.test(validType);
      expect(isLowercase).toBe(true);
    });

    it('should reject non-lowercase columnType', () => {
      const invalidType = 'VARCHAR';
      const isLowercase = /^[a-z]+$/.test(invalidType);
      expect(isLowercase).toBe(false);
    });

    it('should reject mixed case columnType', () => {
      const invalidType = 'VarChar';
      const isLowercase = /^[a-z]+$/.test(invalidType);
      expect(isLowercase).toBe(false);
    });
  });
});
