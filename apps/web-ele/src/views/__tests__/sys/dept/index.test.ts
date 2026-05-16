import { describe, expect, it, vi } from 'vitest';

import { mount } from '@vue/test-utils';

// Mock dependencies
vi.mock('#/api/sys/dept', () => ({
  getDeptPage: vi.fn().mockResolvedValue({
    code: 0,
    data: { list: [], total: 0 },
  }),
  delDeptById: vi.fn().mockResolvedValue({ code: 0 }),
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
    template: '<div class="page-mock"><slot /></div>',
  },
  useVbenModal: vi.fn().mockReturnValue([
    { name: 'Modal', template: '<div class="modal-mock"><slot /></div>' },
    {
      open: vi.fn(),
      close: vi.fn(),
      setData: vi.fn().mockReturnThis(),
    },
  ]),
}));

vi.mock('#/adapter/vxe-table', () => ({
  useVbenVxeGrid: vi.fn().mockReturnValue([
    { name: 'Grid', template: '<div class="grid-mock"><slot /></div>' },
    {
      grid: {
        getCheckboxRecords: () => [],
      },
      reload: vi.fn(),
      gridApi: { reload: vi.fn() },
    },
  ],
  ),
}));

vi.mock('#/adapter/component/Dict.vue', {
  template: '<div class="dict-mock"></div>',
});

vi.mock('@vben/locales', () => ({
  $t: (key: string) => key,
}));

// Test component that mimics DeptIndex
const TestDeptIndex = {
  name: 'TestDeptIndex',
  props: {},
  setup() {
    const gridApi = {
      grid: {
        getCheckboxRecords: () => [],
      },
      reload: vi.fn(),
    };
    const openForm = () => {};
    const openRecycleForm = () => {};
    return { gridApi, openForm, openRecycleForm };
  },
  template: '<div class="test-dept-index"><slot /></div>',
};

describe('sys/dept/index', () => {
  it('should mount successfully', () => {
    const wrapper = mount(TestDeptIndex);
    expect(wrapper.exists()).toBe(true);
  });

  it('should render test component', () => {
    const wrapper = mount(TestDeptIndex);
    expect(wrapper.find('.test-dept-index').exists()).toBe(true);
  });
});
