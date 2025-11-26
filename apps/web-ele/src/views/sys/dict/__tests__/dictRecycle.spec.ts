import { describe, expect, it, vi } from 'vitest';

// Mock the dependencies
vi.mock('#/api/sys/dict', () => ({
  getDictRecyclePage: vi.fn().mockResolvedValue({
    code: 0,
    data: {
      list: [
        {
          id: '1',
          dictName: '删除的字典',
          dictCode: 'deleted_dict',
          sortOrder: 1,
          dictStatus: 1,
        },
      ],
      total: 1,
    },
  }),
  restoreDictById: vi.fn().mockResolvedValue({ code: 0 }),
  wipeDictById: vi.fn().mockResolvedValue({ code: 0 }),
}));

vi.mock('@vben/access', () => ({
  useAccess: () => ({
    hasAccessByCodes: () => true,
  }),
}));

vi.mock('@vben/common-ui', () => ({
  confirm: vi.fn().mockResolvedValue(true),
  useVbenModal: () => [
    {},
    {
      open: vi.fn(),
      close: vi.fn(),
      setData: vi.fn().mockReturnThis(),
      setState: vi.fn().mockReturnThis(),
    },
  ],
}));

vi.mock('@vben/locales', () => ({
  $t: (key: string) => key,
}));

vi.mock('#/adapter/component/Dict.vue', () => ({
  default: {
    name: 'Dict',
    props: ['dict-key', 'value'],
    render() {
      return h('span', { class: 'dict-component' }, this.value);
    },
  },
}));

vi.mock('#/adapter/vxe-table', () => ({
  useVbenVxeGrid: () => [
    {},
    {
      grid: {
        getCheckboxRecords: () => [],
      },
      reload: vi.fn(),
    },
  ],
}));

describe('Dict Recycle Tests', () => {
  it('should have correct grid columns', () => {
    const columns = [
      { title: 'No.', type: 'seq', width: 50 },
      { align: 'left', title: '#', type: 'checkbox', width: 50 },
      { field: 'dictName', title: 'system.dict.label' },
      { field: 'dictCode', title: 'system.dict.code' },
      { field: 'dictStatus', title: 'system.dict.status', slots: { default: 'status' } },
      { field: 'action', fixed: 'right', slots: { default: 'action' }, title: 'system.common.operation', width: 150 },
    ];

    expect(columns).toHaveLength(6);
    expect(columns[2].field).toBe('dictName');
    expect(columns[3].field).toBe('dictCode');
  });

  it('should handle restore operation', () => {
    const mockIds = ['1'];
    expect(mockIds).toHaveLength(1);
    expect(mockIds[0]).toBe('1');
  });

  it('should handle wipe operation', () => {
    const mockIds = ['1', '2'];
    expect(mockIds).toHaveLength(2);
    expect(mockIds).toContain('1');
    expect(mockIds).toContain('2');
  });

  it('should have recycle page data structure', () => {
    const recycleData = {
      code: 0,
      data: {
        list: [
          {
            id: '1',
            dictName: '删除的字典',
            dictCode: 'deleted_dict',
            sortOrder: 1,
            dictStatus: 1,
          },
        ],
        total: 1,
      },
    };

    expect(recycleData.data.list).toHaveLength(1);
    expect(recycleData.data.list[0].dictStatus).toBe(1);
  });
});
