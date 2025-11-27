import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Register from '../register.vue';

describe('Register.vue', () => {
  it('has correct name', () => {
    expect(Register.name).toBe('Register');
  });

  it('has loading state', () => {
    const wrapper = mount(Register, {
      global: {
        stubs: {
          AuthenticationRegister: true,
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });
    expect(wrapper.vm.loading).toBe(false);
  });

  it('has form schema with required fields', () => {
    const wrapper = mount(Register, {
      global: {
        stubs: {
          AuthenticationRegister: true,
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });
    const formSchema = wrapper.vm.formSchema;
    expect(Array.isArray(formSchema)).toBe(true);
    expect(formSchema.length).toBe(4);

    const fieldNames = formSchema.map((item: any) => item.fieldName);
    expect(fieldNames).toContain('username');
    expect(fieldNames).toContain('password');
    expect(fieldNames).toContain('confirmPassword');
    expect(fieldNames).toContain('agreePolicy');
  });

  it('renders properly with mocked dependencies', () => {
    const wrapper = mount(Register, {
      global: {
        stubs: {
          AuthenticationRegister: {
            template: '<div class="stubbed-register"><slot /></div>',
          },
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
