import { mount } from '@vue/test-utils';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import LoginView from './login.vue';

vi.mock('@vben/common-ui', () => ({
  AuthenticationLogin: {
    name: 'AuthenticationLogin',
    props: ['formSchema', 'loading'],
    template: '<div data-testid="auth-login"><slot /></div>',
  },
  SliderCaptcha: {
    name: 'SliderCaptcha',
    props: ['modelValue'],
    template: '<div data-testid="slider-captcha"></div>',
  },
  z: {
    boolean: () => ({
      refine: (fn: (v: boolean) => boolean, opts: any) => ({
        validator: fn,
        ...opts,
      }),
    }),
    string: () => ({
      min: () => ({ optional: () => ({ default: () => ({}) }) }),
      optional: () => ({ default: () => ({}) }),
    }),
  },
}));

vi.mock('@vben/locales', () => ({
  $t: vi.fn((key: string) => key),
}));

const mockAuthStore = {
  authLogin: vi.fn(),
  loginLoading: false,
};

vi.mock('#/store', () => ({
  useAuthStore: vi.fn(() => mockAuthStore),
}));

describe('views/_core/authentication/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthStore.loginLoading = false;
  });

  it('should render login component and pass formSchema with captcha modelPropName', () => {
    const wrapper = mount(LoginView);
    const authLogin = wrapper.find('[data-testid="auth-login"]');
    expect(authLogin.exists()).toBe(true);

    const vm = wrapper.vm as any;
    const schema = vm.formSchema;
    const captchaField = schema.find(
      (field: any) => field.fieldName === 'captcha',
    );
    expect(captchaField).toBeDefined();
    expect(captchaField.modelPropName).toBe('modelValue');
  });

  it('should pass loading state from auth store', () => {
    mockAuthStore.loginLoading = true;
    const wrapper = mount(LoginView);
    const authLoginProps = wrapper
      .findComponent({ name: 'AuthenticationLogin' })
      .props();
    expect(authLoginProps.loading).toBe(true);
  });
});
