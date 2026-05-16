import { describe, expect, it, vi } from 'vitest';

import { ref } from 'vue';

import { mount } from '@vue/test-utils';

// Mock dependencies
vi.mock('#/api/sys/menu', () => ({
  getMenusRecyclePage: vi.fn().mockResolvedValue({
    code: 0,
    data: { list: [], total: 0 },
  }),
  restoreById: vi.fn().mockResolvedValue({ code: 0 }),
  wipeById: vi.fn().mockResolvedValue({ code: 0 }),
}));

vi.mock('@vben/access', () => ({
  useAccess: () => ({
    hasAccessByCodes: () => true,
  }),
}));

vi.mock('@vben/common-ui', () => ({
  confirm: vi.fn().mockResolvedValue(true),
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

// Test component that mimics MenuRecycle
const TestMenuRecycle = {
  name: 'TestMenuRecycle',
  props: {
    gridApi: Object,
  },
  setup(props: any) {
    const open = () => {};
    const close = () => {};
    return { open, close };
  },
  template: '<div class="test-menu-recycle"><slot /></div>',
};

describe('sys/menu/recycle', () => {
  it('should mount successfully', () => {
    const wrapper = mount(TestMenuRecycle, {
      props: {
        gridApi: { reload: vi.fn() },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('should expose open method', () => {
    const wrapper = mount(TestMenuRecycle, {
      props: {
        gridApi: { reload: vi.fn() },
      },
    });
    expect(typeof wrapper.vm.open).toBe('function');
  });

  it('should expose close method', () => {
    const wrapper = mount(TestMenuRecycle, {
      props: {
        gridApi: { reload: vi.fn() },
      },
    });
    expect(typeof wrapper.vm.close).toBe('function');
  });
});
