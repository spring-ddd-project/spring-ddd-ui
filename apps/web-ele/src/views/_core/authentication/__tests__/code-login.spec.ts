import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import CodeLogin from '../code-login.vue';

describe('CodeLogin.vue', () => {
  it('has correct name', () => {
    expect(CodeLogin.name).toBe('CodeLogin');
  });

  it('has loading state', () => {
    const wrapper = mount(CodeLogin, {
      global: {
        stubs: {
          AuthenticationCodeLogin: true,
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });
    expect(wrapper.vm.loading).toBe(false);
  });

  it('has correct code length', () => {
    const wrapper = mount(CodeLogin, {
      global: {
        stubs: {
          AuthenticationCodeLogin: true,
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });
    expect(wrapper.vm.CODE_LENGTH).toBe(6);
  });

  it('renders properly with mocked dependencies', () => {
    const wrapper = mount(CodeLogin, {
      global: {
        stubs: {
          AuthenticationCodeLogin: {
            template: '<div class="authentication-code-login-stub"><slot /></div>',
          },
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.authentication-code-login-stub').exists()).toBe(true);
  });
});
