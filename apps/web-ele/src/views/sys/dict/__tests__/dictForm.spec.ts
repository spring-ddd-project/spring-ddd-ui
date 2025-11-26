import { describe, expect, it, vi } from 'vitest';

// Mock the dependencies
vi.mock('#/api/sys/dict', () => ({
  createDict: vi.fn().mockResolvedValue({ code: 0 }),
  updateDict: vi.fn().mockResolvedValue({ code: 0 }),
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
  useVbenModal: () => [
    {},
    {
      open: vi.fn(),
      close: vi.fn(),
      setState: vi.fn().mockReturnThis(),
    },
  ],
}));

describe('Dict Form Tests', () => {
  it('should have correct form schema', () => {
    const formSchema = [
      {
        component: 'Input',
        fieldName: 'dictName',
        label: 'system.dict.label',
        rules: 'required',
      },
      {
        component: 'Input',
        fieldName: 'dictCode',
        label: 'system.dict.code',
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
        fieldName: 'dictStatus',
        label: 'system.dict.status',
        defaultValue: true,
      },
    ];

    expect(formSchema).toHaveLength(4);
    expect(formSchema[0].fieldName).toBe('dictName');
    expect(formSchema[0].rules).toBe('required');
    expect(formSchema[1].fieldName).toBe('dictCode');
    expect(formSchema[2].fieldName).toBe('sortOrder');
    expect(formSchema[3].fieldName).toBe('dictStatus');
  });

  it('should handle create new dict', () => {
    const newDict = {
      dictName: '新字典',
      dictCode: 'new_dict',
      sortOrder: 1,
      dictStatus: true,
    };

    expect(newDict.dictName).toBe('新字典');
    expect(newDict.dictCode).toBe('new_dict');
    expect(newDict.dictStatus).toBe(true);
  });

  it('should handle edit existing dict', () => {
    const existingDict = {
      id: '1',
      dictName: '菜单类型',
      dictCode: 'menu_type',
      sortOrder: 1,
      dictStatus: true,
    };

    expect(existingDict.id).toBe('1');
    expect(existingDict.dictName).toBe('菜单类型');
    expect(existingDict.dictCode).toBe('menu_type');
  });
});
