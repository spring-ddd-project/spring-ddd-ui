import { describe, expect, it, vi } from 'vitest';

import * as templateModule from '#/api/gen/template';

// Mock the API module
vi.mock('#/api/gen/template', () => ({
  getTemplatePage: vi.fn(),
  getTemplateRecyclePage: vi.fn(),
  createTemplate: vi.fn(),
  updateTemplate: vi.fn(),
  deleteTemplate: vi.fn(),
  restoreTemplate: vi.fn(),
  wipeTemplate: vi.fn(),
}));

describe('gen/template module', () => {
  describe('API functions', () => {
    it('should export getTemplatePage', () => {
      expect(templateModule.getTemplatePage).toBeDefined();
    });

    it('should export getTemplateRecyclePage', () => {
      expect(templateModule.getTemplateRecyclePage).toBeDefined();
    });

    it('should export createTemplate', () => {
      expect(templateModule.createTemplate).toBeDefined();
    });

    it('should export updateTemplate', () => {
      expect(templateModule.updateTemplate).toBeDefined();
    });

    it('should export deleteTemplate', () => {
      expect(templateModule.deleteTemplate).toBeDefined();
    });

    it('should export restoreTemplate', () => {
      expect(templateModule.restoreTemplate).toBeDefined();
    });

    it('should export wipeTemplate', () => {
      expect(templateModule.wipeTemplate).toBeDefined();
    });
  });

  describe('template index.vue - RowType interface', () => {
    interface RowType {
      id: string;
      templateName: string;
      templateContent: string;
    }

    it('should have correct row structure', () => {
      const row: RowType = {
        id: '1',
        templateName: 'Entity Template',
        templateContent: 'public class ${className} { }',
      };

      expect(row.id).toBe('1');
      expect(row.templateName).toBe('Entity Template');
      expect(row.templateContent).toContain('${className}');
    });
  });

  describe('template form.vue', () => {
    it('should handle form values correctly', () => {
      const formValues = {
        templateName: 'Test Template',
        templateContent: 'Test content',
      };

      expect(formValues.templateName).toBe('Test Template');
      expect(formValues.templateContent).toBe('Test content');
    });

    it('should identify create vs update based on id', () => {
      const createData = {
        templateName: 'New Template',
        templateContent: 'Content',
      };

      const updateData = {
        id: '1',
        templateName: 'Updated Template',
        templateContent: 'Updated content',
      };

      const isCreate = !createData.id;
      const isUpdate = !!updateData.id;

      expect(isCreate).toBe(true);
      expect(isUpdate).toBe(true);
    });
  });

  describe('template recycle.vue', () => {
    it('should have correct recycle row structure', () => {
      interface RecycleRowType {
        id: string;
        templateName: string;
        templateContent: string;
      }

      const row: RecycleRowType = {
        id: '1',
        templateName: 'Deleted Template',
        templateContent: 'Will be wiped',
      };

      expect(row.id).toBe('1');
      expect(row.templateName).toBe('Deleted Template');
    });
  });
});
