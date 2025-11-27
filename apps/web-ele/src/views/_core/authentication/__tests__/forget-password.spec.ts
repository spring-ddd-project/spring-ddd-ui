import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import ForgetPassword from '../forget-password.vue';

describe('ForgetPassword.vue', () => {
  it('has correct name', () => {
    expect(ForgetPassword.name).toBe('ForgetPassword');
  });

  it('has loading state', () => {
    const wrapper = mount(ForgetPassword, {
      global: {
        stubs: {
          AuthenticationForgetPassword: true,
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });
    expect(wrapper.vm.loading).toBe(false);
  });

  it('has form schema defined', () => {
    const wrapper = mount(ForgetPassword, {
      global: {
        stubs: {
          AuthenticationForgetPassword: true,
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });
    const formSchema = wrapper.vm.formSchema;
    expect(Array.isArray(formSchema)).toBe(true);
    expect(formSchema.length).toBeGreaterThan(0);
  });
});
