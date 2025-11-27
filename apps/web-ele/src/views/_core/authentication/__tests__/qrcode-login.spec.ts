import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import QrCodeLogin from '../qrcode-login.vue';

describe('QrCodeLogin.vue', () => {
  it('has correct name', () => {
    expect(QrCodeLogin.name).toBe('QrCodeLogin');
  });

  it('renders properly with mocked dependencies', () => {
    const wrapper = mount(QrCodeLogin, {
      global: {
        stubs: {
          AuthenticationQrCodeLogin: {
            template: '<div class="authentication-qrcode-login-stub"><slot /></div>',
          },
        },
        mocks: {
          LOGIN_PATH: '/login',
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.authentication-qrcode-login-stub').exists()).toBe(true);
  });
});
