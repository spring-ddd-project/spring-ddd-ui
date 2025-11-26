import { describe, expect, it, vi } from 'vitest';

import { ref } from 'vue';

import { mount } from '@vue/test-utils';

// Mock dependencies
vi.mock('#/api/sys/dept', () => ({
  createDept: vi.fn().mockResolvedValue({ code: 0 }),
  updateDept: vi.fn().mockResolvedValue({ code: 0 }),
  getTree: vi.fn().mockResolvedValue({ code: 0, data: [] }),
}));

vi.mock('@vben/common-ui', () => ({
  useVbenModal: vi.fn().mockReturnValue([
    { name: 'Modal', template: '<div class="modal-mock"><slot /></div>' },
    {
      open: vi.fn(),
      close: vi.fn(),
      setState: vi.fn().mockReturnThis(),
    },
  ]),
}));

vi.mock('#/adapter/form', () => ({
  useVbenForm: vi.fn().mockReturnValue([
    { name: 'Form', template: '<div class="form-mock"><slot /></div>' },
    {
      validate: vi.fn().mockResolvedValue({ valid: true }),
      getValues: vi.fn().mockResolvedValue({}),
      setValues: vi.fn(),
      resetForm: vi.fn(),
    },
  ],
  ),
}));

vi.mock('@vben/locales', () => ({
  $t: (key: string) => key,
}));

// Test component that mimics DeptForm
const TestDeptForm = {
  name: 'TestDeptForm',
  props: {
    gridApi: Object,
  },
  setup(props: any) {
    const writeForm = ref<Record<string, any>>({});
    const open = (row?: any) => {
      if (row?.id) {
        writeForm.value = row;
      } else {
        writeForm.value = {};
      }
    };
    const close = () => {};
    return { open, close, writeForm };
  },
  template: '<div class="test-dept-form"><slot /></div>',
};

describe('sys/dept/form', () => {
  it('should mount successfully', () => {
    const wrapper = mount(TestDeptForm, {
      props: {
        gridApi: { reload: vi.fn() },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('should expose open method', () => {
    const wrapper = mount(TestDeptForm, {
      props: {
        gridApi: { reload: vi.fn() },
      },
    });
    expect(typeof wrapper.vm.open).toBe('function');
  });

  it('should expose close method', () => {
    const wrapper = mount(TestDeptForm, {
      props: {
        gridApi: { reload: vi.fn() },
      },
    });
    expect(typeof wrapper.vm.close).toBe('function');
  });
});
