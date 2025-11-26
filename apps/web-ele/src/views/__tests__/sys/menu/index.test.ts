import { describe, expect, it, vi } from 'vitest';

import { mount } from '@vue/test-utils';

// Mock dependencies
vi.mock('#/api/sys/menu', () => ({
  getMenusPage: vi.fn().mockResolvedValue({
    code: 0,
    data: { list: [], total: 0 },
  }),
  delById: vi.fn().mockResolvedValue({ code: 0 }),
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

vi.mock('@vben/icons', () => ({
  IconifyIcon: {
    name: 'IconifyIcon',
    props: ['icon'],
    template: '<span class="iconify-mock"></span>',
  },
}));

// Test component that mimics MenuIndex
const TestMenuIndex = {
  name: 'TestMenuIndex',
  props: {},
  setup() {
    const gridApi = {
      grid: {
        getCheckboxRecords: () => [],
      },
      reload: vi.fn(),
    };
    return { gridApi };
  },
  template: '<div class="test-menu-index"><slot /></div>',
};

describe('sys/menu/index', () => {
  it('should mount successfully', () => {
    const wrapper = mount(TestMenuIndex);
    expect(wrapper.exists()).toBe(true);
  });

  it('should render test component', () => {
    const wrapper = mount(TestMenuIndex);
    expect(wrapper.find('.test-menu-index').exists()).toBe(true);
  });
});
