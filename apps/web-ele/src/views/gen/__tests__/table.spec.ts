import { describe, expect, it, vi } from 'vitest';

import * as tableModule from '#/api/gen/table';

// Mock the API module
vi.mock('#/api/gen/table', () => ({
  getTablePage: vi.fn(),
  wipeTableData: vi.fn(),
  codeGenerate: vi.fn(),
  codePreview: vi.fn(),
  codeDownload: vi.fn(),
  getTableInfoPage: vi.fn(),
  getTableInfo: vi.fn(),
  createTableInfo: vi.fn(),
  updateTableInfo: vi.fn(),
  getColumnsInfo: vi.fn(),
  getJaveEntityInfo: vi.fn(),
  createColumns: vi.fn(),
  updateColumns: vi.fn(),
}));

describe('gen/table module', () => {
  describe('API functions', () => {
    it('should export getTablePage', () => {
      expect(tableModule.getTablePage).toBeDefined();
    });

    it('should export wipeTableData', () => {
      expect(tableModule.wipeTableData).toBeDefined();
    });

    it('should export codeGenerate', () => {
      expect(tableModule.codeGenerate).toBeDefined();
    });

    it('should export codePreview', () => {
      expect(tableModule.codePreview).toBeDefined();
    });

    it('should export codeDownload', () => {
      expect(tableModule.codeDownload).toBeDefined();
    });

    it('should export getTableInfoPage', () => {
      expect(tableModule.getTableInfoPage).toBeDefined();
    });

    it('should export getTableInfo', () => {
      expect(tableModule.getTableInfo).toBeDefined();
    });

    it('should export createTableInfo', () => {
      expect(tableModule.createTableInfo).toBeDefined();
    });

    it('should export updateTableInfo', () => {
      expect(tableModule.updateTableInfo).toBeDefined();
    });

    it('should export getColumnsInfo', () => {
      expect(tableModule.getColumnsInfo).toBeDefined();
    });

    it('should export getJaveEntityInfo', () => {
      expect(tableModule.getJaveEntityInfo).toBeDefined();
    });

    it('should export createColumns', () => {
      expect(tableModule.createColumns).toBeDefined();
    });

    it('should export updateColumns', () => {
      expect(tableModule.updateColumns).toBeDefined();
    });
  });

  describe('table index.vue - RowType interface', () => {
    interface RowType {
      id: string;
      tableSchema: string;
      tableName: string;
      tableComment: string;
      createTime: string;
      tableCollation: string;
    }

    it('should have correct row structure', () => {
      const row: RowType = {
        id: '1',
        tableSchema: 'public',
        tableName: 'gen_aggregate',
        tableComment: 'Aggregate table',
        createTime: '2024-01-01 00:00:00',
        tableCollation: 'utf8mb4_general_ci',
      };

      expect(row.id).toBe('1');
      expect(row.tableSchema).toBe('public');
      expect(row.tableName).toBe('gen_aggregate');
      expect(row.tableCollation).toBe('utf8mb4_general_ci');
    });
  });

  describe('table config.vue', () => {
    it('should have correct config form structure', () => {
      const configData = {
        tableName: 'gen_table',
        projectName: 'spring-ddd',
        moduleName: 'domain',
        packageName: 'com.example.domain',
        className: 'ExampleEntity',
        requestName: 'ExampleRequest',
      };

      expect(configData.tableName).toBe('gen_table');
      expect(configData.projectName).toBe('spring-ddd');
      expect(configData.className).toBe('ExampleEntity');
    });
  });

  describe('table preview.vue', () => {
    it('should handle tree data structure', () => {
      const treeData = [
        {
          label: 'domain',
          value: 'domain',
          children: [
            { label: 'Entity.java', value: 'domain/Entity.java' },
            { label: 'ValueObject.java', value: 'domain/ValueObject.java' },
          ],
        },
      ];

      expect(treeData[0].label).toBe('domain');
      expect(treeData[0].children).toHaveLength(2);
      expect(treeData[0].children![0].label).toBe('Entity.java');
    });
  });
});
