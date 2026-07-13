import { __responseInterceptors } from '@vben/request';
import { __mockAccessStore } from '@vben/stores';

import { ElMessage } from 'element-plus';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { __mockRouter } from '#/router';

import { refreshTokenApi } from './core';
// Import the module under test after mocks are established.
import { requestClient } from './request';
import { findMenuIdByPath } from './utils/menu-resolver';

vi.mock('@vben/request', () => {
  const requestInterceptors: any[] = [];
  const responseInterceptors: any[] = [];

  class MockRequestClient {
    public interceptors = requestInterceptors;

    addRequestInterceptor(interceptor: any) {
      this.interceptors.push(interceptor);
      return interceptor;
    }

    addResponseInterceptor(interceptor: any) {
      responseInterceptors.push(interceptor);
      return interceptor;
    }
  }

  return {
    __requestInterceptors: requestInterceptors,
    __responseInterceptors: responseInterceptors,
    RequestClient: MockRequestClient,
    authenticateResponseInterceptor: vi.fn((args: any) => args),
    defaultResponseInterceptor: vi.fn((args: any) => args),
    errorMessageResponseInterceptor: vi.fn((handler: any) => handler),
  };
});

vi.mock('@vben/hooks', () => ({
  useAppConfig: vi.fn(() => ({ apiURL: 'http://test-api' })),
}));

vi.mock('@vben/preferences', () => ({
  preferences: {
    app: {
      accessMode: 'backend',
      enableRefreshToken: true,
      locale: 'zh-CN',
      loginExpiredMode: 'page',
    },
  },
}));

vi.mock('@vben/stores', () => {
  const mockAccessStore = {
    accessToken: 'test-token',
    getMenuByPath: vi.fn(),
    isAccessChecked: true,
    setAccessToken: vi.fn(),
    setLoginExpired: vi.fn(),
  };
  return {
    __mockAccessStore: mockAccessStore,
    useAccessStore: vi.fn(() => mockAccessStore),
  };
});

vi.mock('element-plus', () => ({
  ElMessage: { error: vi.fn() },
}));

vi.mock('#/router', () => {
  const mockRouter = {
    currentRoute: { value: { path: '/system/dict' } },
  };
  return {
    __mockRouter: mockRouter,
    router: mockRouter,
  };
});

vi.mock('#/store', () => {
  const mockAuthStore = {
    logout: vi.fn(),
  };
  return {
    __mockAuthStore: mockAuthStore,
    useAuthStore: vi.fn(() => mockAuthStore),
  };
});

vi.mock('./core', () => ({
  refreshTokenApi: vi.fn(),
}));

vi.mock('./utils/menu-resolver', () => ({
  findMenuIdByPath: vi.fn(),
}));

describe('api/request', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    __mockAccessStore.accessToken = 'test-token';
    __mockRouter.currentRoute.value = { path: '/system/dict' };
  });

  function getRequestInterceptor() {
    expect(requestClient.interceptors.length).toBeGreaterThan(0);
    return requestClient.interceptors[0];
  }

  it('should set Authorization and Accept-Language headers', async () => {
    const config = { headers: {} };
    const interceptor = getRequestInterceptor();
    const result = await interceptor.fulfilled(config);

    expect(result.headers.Authorization).toBe('Bearer test-token');
    expect(result.headers['Accept-Language']).toBe('zh-CN');
  });

  it('should set X-Menu-Id from access store menu', async () => {
    __mockAccessStore.getMenuByPath.mockReturnValue({ id: 42 });
    const config = { headers: {} };
    const interceptor = getRequestInterceptor();
    const result = await interceptor.fulfilled(config);

    expect(__mockAccessStore.getMenuByPath).toHaveBeenCalledWith(
      '/system/dict',
    );
    expect(result.headers['X-Menu-Id']).toBe('42');
    expect(findMenuIdByPath).not.toHaveBeenCalled();
  });

  it('should fallback to findMenuIdByPath when access store has no menu', async () => {
    __mockAccessStore.getMenuByPath.mockReturnValue(undefined);
    vi.mocked(findMenuIdByPath).mockReturnValue(99);
    const config = { headers: {} };
    const interceptor = getRequestInterceptor();
    const result = await interceptor.fulfilled(config);

    expect(findMenuIdByPath).toHaveBeenCalledWith('/system/dict');
    expect(result.headers['X-Menu-Id']).toBe('99');
  });

  it('should not set X-Menu-Id when no menu is found anywhere', async () => {
    __mockAccessStore.getMenuByPath.mockReturnValue(undefined);
    vi.mocked(findMenuIdByPath).mockReturnValue(undefined);
    const config = { headers: {} };
    const interceptor = getRequestInterceptor();
    const result = await interceptor.fulfilled(config);

    expect(result.headers['X-Menu-Id']).toBeUndefined();
  });

  it('should handle /index suffix in current route path', async () => {
    __mockRouter.currentRoute.value = { path: '/system/dict/index' };
    __mockAccessStore.getMenuByPath.mockReturnValue({ id: 7 });
    const config = { headers: {} };
    const interceptor = getRequestInterceptor();
    const result = await interceptor.fulfilled(config);

    expect(result.headers['X-Menu-Id']).toBe('7');
  });

  it('should refresh token and update access store', async () => {
    vi.mocked(refreshTokenApi).mockResolvedValue({ data: 'new-token' });
    const authConfig = __responseInterceptors[1] as {
      doRefreshToken: () => Promise<string>;
    };
    const token = await authConfig.doRefreshToken();
    expect(token).toBe('new-token');
    expect(__mockAccessStore.setAccessToken).toHaveBeenCalledWith('new-token');
  });

  it('should show error message from response data', () => {
    const errorHandler = __responseInterceptors[2] as (
      msg: string,
      error: any,
    ) => void;
    errorHandler('fallback message', {
      response: { data: { error: 'server error' } },
    });
    expect(ElMessage.error).toHaveBeenCalledWith('server error');
  });

  it('should fallback to msg when no response error', () => {
    const errorHandler = __responseInterceptors[2] as (
      msg: string,
      error: any,
    ) => void;
    errorHandler('fallback message', {});
    expect(ElMessage.error).toHaveBeenCalledWith('fallback message');
  });
});
