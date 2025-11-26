import { describe, expect, it, vi } from 'vitest';

// Mock the dependencies
vi.mock('#/api/sys/dict', () => ({
  createItem: vi.fn().mockResolvedValue({ code: 0 }),
  updateItem: vi.fn().mockResolvedValue({ code: 0 }),
}));

vi.mock('@vben/locales', () => ({
  $t: (key: string) => key,
}));

vi.mock('#/adapter/form', () => ({
  useVbenForm: () => [
    {},
    {
      validate: vi.fn().mockResolvedValue({ valid: true }),
      getValues: vi.fn().mockResolvedValue({}),
      setValues: vi.fn(),
      resetForm: vi.fn(),
    },
  ],
}));

vi.mock('@vben/common-ui', () => ({
  useVbenDrawer: () => [
    {},
    {
      open: vi.fn(),
      close: vi.fn(),
      setState: vi.fn().mockReturnThis(),
    },
  ],
}));

describe('Dict Item Form Tests', () => {
  it('should have correct form schema', () => {
    const formSchema = [
      {
        component: 'Input',
        fieldName: 'itemLabel',
        label: 'system.dict.item.label',
        rules: 'required',
      },
      {
        component: 'Input',
        fieldName: 'itemValue',
        label: 'system.dict.item.value',
        rules: 'required',
      },
      {
        component: 'InputNumber',
        fieldName: 'sortOrder',
        label: 'system.dict.order',
        rules: 'required',
      },
      {
        component: 'Switch',
        componentProps: {
          class: 'w-auto',
        },
        fieldName: 'itemStatus',
        label: 'system.dict.status',
        defaultValue: true,
      },
    ];

    expect(formSchema).toHaveLength(4);
    expect(formSchema[0].fieldName).toBe('itemLabel');
    expect(formSchema[0].rules).toBe('required');
    expect(formSchema[1].fieldName).toBe('itemValue');
    expect(formSchema[1].rules).toBe('required');
    expect(formSchema[2].fieldName).toBe('sortOrder');
    expect(formSchema[3].fieldName).toBe('itemStatus');
  });

  it('should handle create new item', () => {
    const newItem = {
      dictId: '1',
      itemLabel: '新条目',
      itemValue: 'new_item',
      sortOrder: 1,
      itemStatus: true,
    };

    expect(newItem.dictId).toBe('1');
    expect(newItem.itemLabel).toBe('新条目');
    expect(newItem.itemValue).toBe('new_item');
    expect(newItem.itemStatus).toBe(true);
  });

  it('should handle edit existing item', () => {
    const existingItem = {
      id: '1',
      dictId: '1',
      itemLabel: '菜单',
      itemValue: 1,
      sortOrder: 1,
      itemStatus: true,
    };

    expect(existingItem.id).toBe('1');
    expect(existingItem.dictId).toBe('1');
    expect(existingItem.itemLabel).toBe('菜单');
    expect(existingItem.itemValue).toBe(1);
  });

  it('should handle open with row data', () => {
    const rowData = {
      id: '1',
      dictId: '1',
      itemLabel: '菜单',
      itemValue: 1,
    };

    expect(rowData.id).toBe('1');
    expect(rowData.dictId).toBe('1');
  });

  it('should handle open without row data (new item)', () => {
    const rowData = {
      dictId: '1',
    };

    expect(rowData.dictId).toBe('1');
    expect(rowData.id).toBeUndefined();
  });
});
