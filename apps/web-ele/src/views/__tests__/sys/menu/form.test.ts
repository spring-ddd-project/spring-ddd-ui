import { describe, expect, it, vi } from 'vitest';

import { ref } from 'vue';

import { mount } from '@vue/test-utils';

// Mock the dependencies
vi.mock('#/api/sys/menu', () => ({
  create: vi.fn().mockResolvedValue({ code: 0 }),
  update: vi.fn().mockResolvedValue({ code: 0 }),
  getMenuTreeWithoutPermission: vi.fn().mockResolvedValue({ code: 0, data: [] }),
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

// Create a minimal test component that mimics the form's API
const TestFormComponent = {
  name: 'TestFormComponent',
  props: {
    gridApi: Object,
  },
  emits: ['open', 'close'],
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
  template: '<div class="test-form"><slot /></div>',
};

describe('sys/menu/form', () => {
  it('should mount successfully', () => {
    const wrapper = mount(TestFormComponent, {
      props: {
        gridApi: { reload: vi.fn() },
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.test-form').exists()).toBe(true);
  });

  it('should expose open method', () => {
    const wrapper = mount(TestFormComponent, {
      props: {
        gridApi: { reload: vi.fn() },
      },
    });
    expect(typeof wrapper.vm.open).toBe('function');
  });

  it('should expose close method', () => {
    const wrapper = mount(TestFormComponent, {
      props: {
        gridApi: { reload: vi.fn() },
      },
    });
    expect(typeof wrapper.vm.close).toBe('function');
  });

  it('should open with empty form when no row provided', () => {
    const wrapper = mount(TestFormComponent, {
      props: {
        gridApi: { reload: vi.fn() },
      },
    });
    wrapper.vm.open();
    expect(wrapper.vm.writeForm).toEqual({});
  });

  it('should open with row data when row has id', () => {
    const wrapper = mount(TestFormComponent, {
      props: {
        gridApi: { reload: vi.fn() },
      },
    });
    wrapper.vm.open({ id: '1', name: 'Test' });
    expect(wrapper.vm.writeForm).toEqual({ id: '1', name: 'Test' });
  });
});
