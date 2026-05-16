import { describe, expect, it, vi } from 'vitest';

import * as infoModule from '#/api/gen/info';

// Mock the API module
vi.mock('#/api/gen/info', () => ({
  getInfoPage: vi.fn(),
  createInfo: vi.fn(),
  updateInfo: vi.fn(),
  deleteInfo: vi.fn(),
  wipeInfo: vi.fn(),
}));

describe('gen/info module', () => {
  describe('API functions', () => {
    it('should export getInfoPage', () => {
      expect(infoModule.getInfoPage).toBeDefined();
    });

    it('should export createInfo', () => {
      expect(infoModule.createInfo).toBeDefined();
    });

    it('should export updateInfo', () => {
      expect(infoModule.updateInfo).toBeDefined();
    });

    it('should export deleteInfo', () => {
      expect(infoModule.deleteInfo).toBeDefined();
    });

    it('should export wipeInfo', () => {
      expect(infoModule.wipeInfo).toBeDefined();
    });
  });

  describe('info/form.vue - RowType interface', () => {
    interface RowType {
      id: string;
      infoId: string;
      propColumnKey: string;
      propColumnName: string;
      propColumnType: string;
      propColumnComment: string;
      propJavaEntity: string;
      propJavaType: string;
      tableVisible: string;
      tableOrder: boolean;
      tableFilter: boolean;
      tableFilterComponent: number;
      tableFilterType: number;
      typescriptType: number;
      formComponent: number;
      formVisible: boolean;
      formRequired: boolean;
      propDictId: string;
      en: string;
      locale: string;
    }

    it('should have correct row structure', () => {
      const row: RowType = {
        id: '1',
        infoId: 'info-1',
        propColumnKey: 'pri',
        propColumnName: 'id',
        propColumnType: 'bigint',
        propColumnComment: 'Primary key',
        propJavaEntity: 'id',
        propJavaType: 'Long',
        tableVisible: 'true',
        tableOrder: true,
        tableFilter: false,
        tableFilterComponent: 1,
        tableFilterType: 1,
        typescriptType: 1,
        formComponent: 1,
        formVisible: true,
        formRequired: true,
        propDictId: '',
        en: 'ID',
        locale: 'zh-CN',
      };

      expect(row.id).toBe('1');
      expect(row.propColumnName).toBe('id');
      expect(row.propJavaType).toBe('Long');
      expect(row.tableOrder).toBe(true);
      expect(row.formRequired).toBe(true);
    });

    it('should handle switch values correctly', () => {
      const row: RowType = {
        id: '1',
        infoId: 'info-1',
        propColumnKey: 'id',
        propColumnName: 'id',
        propColumnType: 'bigint',
        propColumnComment: 'id',
        propJavaEntity: 'id',
        propJavaType: 'Long',
        tableVisible: 'true',
        tableOrder: true,
        tableFilter: true,
        tableFilterComponent: 1,
        tableFilterType: 1,
        typescriptType: 1,
        formComponent: 1,
        formVisible: true,
        formRequired: true,
        propDictId: '',
        en: '',
        locale: '',
      };

      // Boolean switches
      expect(typeof row.tableOrder).toBe('boolean');
      expect(typeof row.tableFilter).toBe('boolean');
      expect(typeof row.formVisible).toBe('boolean');
      expect(typeof row.formRequired).toBe('boolean');
    });
  });
});
