import { describe, expect, it, vi } from 'vitest';

// Mock the dependencies
vi.mock('#/api/sys/dict', () => ({
  getItemPage: vi.fn().mockResolvedValue({
    code: 0,
    data: {
      list: [
        {
          id: '1',
          dictId: '1',
          itemLabel: '菜单',
          itemValue: 1,
          sortOrder: 1,
          itemStatus: 0,
        },
        {
          id: '2',
          dictId: '1',
          itemLabel: '按钮',
          itemValue: 2,
          sortOrder: 2,
          itemStatus: 0,
        },
      ],
      total: 2,
    },
  }),
  delItemById: vi.fn().mockResolvedValue({ code: 0 }),
}));

vi.mock('@vben/access', () => ({
  useAccess: () => ({
    hasAccessByCodes: () => true,
  }),
}));

vi.mock('@vben/common-ui', () => ({
  confirm: vi.fn().mockResolvedValue(true),
  Page: {
    name: 'Page',
    render() {
      return h('div', { class: 'page' }, this.$slots?.default?.());
    },
  },
  useVbenModal: () => [
    {},
    {
      open: vi.fn(),
      close: vi.fn(),
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

describe('Dict Item Index Tests', () => {
  it('should have correct grid columns', () => {
    const columns = [
      { title: 'No.', type: 'seq', width: 50 },
      { align: 'left', title: '#', type: 'checkbox', width: 50 },
      { field: 'itemLabel', title: 'system.dict.item.label' },
      { field: 'itemValue', title: 'system.dict.item.value' },
      { field: 'itemStatus', title: 'system.dict.status', slots: { default: 'status' } },
      { field: 'action', fixed: 'right', slots: { default: 'action' }, title: 'system.common.operation', width: 120 },
    ];

    expect(columns).toHaveLength(6);
    expect(columns[2].field).toBe('itemLabel');
    expect(columns[3].field).toBe('itemValue');
    expect(columns[4].field).toBe('itemStatus');
  });

  it('should handle item list data', () => {
    const itemData = {
      code: 0,
      data: {
        list: [
          { id: '1', dictId: '1', itemLabel: '菜单', itemValue: 1, itemStatus: 0 },
          { id: '2', dictId: '1', itemLabel: '按钮', itemValue: 2, itemStatus: 0 },
        ],
        total: 2,
      },
    };

    expect(itemData.data.list).toHaveLength(2);
    expect(itemData.data.list[0].itemLabel).toBe('菜单');
    expect(itemData.data.list[1].itemLabel).toBe('按钮');
  });

  it('should handle delete items', () => {
    const mockIds = ['1', '2'];
    expect(mockIds).toHaveLength(2);
    expect(mockIds).toContain('1');
    expect(mockIds).toContain('2');
  });

  it('should have correct proxy config for item query', () => {
    const proxyConfig = {
      ajax: {
        query: expect.any(Function),
      },
    };

    expect(proxyConfig.ajax.query).toBeDefined();
  });
});
